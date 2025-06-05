import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Cadastro de um novo Paciente");

        this.doc = {
            _key: "",
            name: "",
            description: "",
            status: "",
            phone: "",
            questionnaires: []
        };

        this.questionnaires = [];
        this.questions = [];
    }

    async getMenu() {
        return await this.NavBar()
        + await this.StandardMenu('patient','Paciente');
    }

    async init() {
        const _key = this.params._key;
        if (_key) {
            this.doc = await fetchData(`/patient/${_key}`, "GET");
            this.questionnaires = await fetchData("/questionnaire", "GET");
            this.questions = await fetchData("/question", "GET");
            this.questionnairesRelationship = await fetchData(`/Patient/${this.doc._key}/questionarios`, 'GET');
        }
    }

    getModal() {
        return modalSelect({
            id: "Questionnaire",
            id_key: "Patient",
            label: "Questionário",
            items: this.questionnaires,
            saveFunction: saveToModalSelect(`patient/${this.doc._key}/add-questionario`, "existingQuestionnaires")
        });
    }

    async getHtml() {
        let html = `
            <h2>Id do Paciente: ${this.doc._key}</h2>
            <input type="hidden" class="aof-input" id="_key" value="${this.doc._key}">
            <div class="card">
                <div class="card-body">
                    ${this.renderFormFields()}
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick="SalvarPatient()">Salvar</button>
                    ${this.doc._key ? `<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalQuestionnaire">Adicionar Questionário</button>` : ''}
                </div>
            </div>
            ${this.doc._key ? this.getModal() : ''}
            ${this.doc._key ? await this.renderQuestionariosSection() : ''}
        `;
        return html;
    }

    renderFormFields() {
        return `
        
            <div class="form-floating mb-2">
             <input class="form-control aof-input" type="hidden" id="questionnaires" value="${this.doc.questionnaires}">
                <input class="form-control aof-input" type="text" id="name" value="${this.doc.name}" placeholder="name" required>
                <label for="name">Nome:</label>
            </div>
            <div class="form-floating mb-2">
                <input class="form-control aof-input" type="tel" id="phone" value="${this.doc.phone}" placeholder="phone" required>
                <label for="phone">Contado:</label>
            </div>
            <div class="form-floating mb-2">
                <input class="form-control aof-input" type="text" id="description" value="${this.doc.description}" placeholder="description" required>
                <label for="description">Descrição:</label>
            </div>
            <div class="form-floating mb-2">
                <select class="form-select aof-input" id="status" required>
                    <option value="1" ${this.doc.status == 1 ? 'selected' : ''}>Opção 1</option>
                    <option value="2" ${this.doc.status == 2 ? 'selected' : ''}>Opção 2</option>
                    <option value="3" ${this.doc.status == 3 ? 'selected' : ''}>Opção 3</option>
                </select>
                <label for="status">Status:</label>
            </div>
        `;
    }


    async renderQuestionariosSection() {
      if (!this.doc.questionnaires?.length) {
          return `<div class="alert alert-info mt-4">Nenhum questionário associado.</div>`;
      }

      const map = {};
      (this.questionnairesRelationship || []).forEach(q => map[q._key] = q);
      const accordionId = 'accordionQuestionarios';
      const headerId = 'headingAll';
      const collapseId = 'collapseAll';

      // Generate cards for all questionários
      const cardsHtml = this.doc.questionnaires.map(key => {
          const q = map[key];
          if (!q) {
              return `<div class="card mb-3 border-danger"><div class="card-body text-danger">Questionário não encontrado: ${key}</div></div>`;
          }
          const questionCards = Array.isArray(q.questions)
              ? q.questions.map(qKey => {
                  const question = this.questions.find(qq => qq._key === qKey);
                  if (!question) return `<div class="col"><div class="alert alert-danger">Pergunta ${qKey} não encontrada.</div></div>`;
                  const alts = [question.alternative1, question.alternative2, question.alternative3, question.alternative4];
                  const idxAlt = parseInt(question.correct, 10) - 1;
                  return `<div class="col"><div class="card h-100"><div class="card-body"><h6 class="card-title">${question.question}</h6><ul class="list-group list-group-flush">${alts.map((alt,i)=>`<li class="list-group-item ${i===idxAlt?'bg-success text-white':''}">${String.fromCharCode(65+i)}) ${alt}</li>`).join('')}</ul></div></div></div>`;
                }).join('')
              : `<div class="alert alert-warning p-3">Sem perguntas.</div>`;

          return `
          <div class="card shadow-sm border-primary mb-4">
              <div class="card-header bg-primary text-white">
                  <strong>${q.name}</strong>
              </div>
              <div class="card-body">
                  <p>${q.description || 'Sem descrição'}</p>
                  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">${questionCards}</div>
                  <a href="/questionnaire/${q._key}" target="_blank" class="btn btn-info btn-sm mt-3">Acessar</a>
              </div>
          </div>`;
      }).join('');

      // Single accordion for all
      return `
      <div class="mt-5">
          <div class="accordion" id="${accordionId}">
              <div class="accordion-item">
                  <h2 class="accordion-header" id="${headerId}">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="true" aria-controls="${collapseId}">
                          Questionários Associados
                      </button>
                  </h2>
                  <div id="${collapseId}" class="accordion-collapse collapse show" aria-labelledby="${headerId}" data-bs-parent="#${accordionId}">
                      <div class="accordion-body">
                          ${cardsHtml}
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
  }
}

window.SalvarPatient = async function() {
    const data = await copy();
    data.questionnaires = formatToList(data.questionnaires);
    try {
        const url = data._key ? `/patient/${data._key}` : `/patient`;
        await save(url, data);
        window.location.href = "/patient/list";
    } catch (err) {
        console.error("Erro ao salvar paciente:", err);
        alert("Erro ao salvar paciente.");
    }
};
