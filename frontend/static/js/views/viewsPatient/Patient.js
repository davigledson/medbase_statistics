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
            questionarios: [],
            statusQuestinarios: [],
        };

        this.questionarios = [];
        this.questions = [];
    }

    async getMenu() {
        return await this.StandardMenu('patient');
    }

    async init() {
        const _key = this.params._key;
        if (!!_key) {
            this.doc = await fetchData(`/patient/${_key}`, "GET");
            this.questionarios = await fetchData("/Questionario", "GET");
            this.questions = await fetchData("/question", "GET");  
        }
    }

    
    getModal() {
        return modalSelect({
            id: "Questionario",
            id_key: "Patient",
            label: "Questionário",
            items: this.questionarios,
            saveFunction: saveToModalSelect(`patient/${this.doc._key}/add-questionario`, "existingQuestionarios")
        });
    }
    

    async getHtml() {
        let row = `
        <h2>Id do Paciente: ${this.doc._key}</h2>
        <input type="hidden" class="aof-input" id="_key" value="${this.doc._key}">
        <div class="card">
          <div class="card-head">
            <input type="hidden" class="aof-input" id="questionarios" value='${this.doc.questionarios}'>
            <div class="form-floating mb-2">
              <input class="form-control aof-input" type="text" id="name" value="${this.doc.name}" placeholder="name" required>
              <label for="name">Nome:</label>
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
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary" onclick="SalvarPatient()">Salvar</button>
            ${this.doc._key ? `
              <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalQuestionario">
                Adicionar Questionário
              </button>` : ''}
          </div>
        </div>
        ${this.doc._key ? this.getModal() : ''}
        `;

        if (Array.isArray(this.doc.statusQuestinarios) && this.doc.statusQuestinarios.length > 0) {
            row += `
            <h3 class="mt-4">Histórico de Respostas dos Questionários</h3>
            <div class="table-responsive">
              <table class="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>Questionário</th>
                    <th>Pergunta</th>
                    <th>Acertou?</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.doc.statusQuestinarios.map(item => item.respostas.map(r => `
                    <tr>
                      <td>${item.questionario_key}</td>
                      <td>${r.pergunta_key}</td>
                      <td>${r.acertou ? '✔️' : '❌'}</td>
                    </tr>
                  `).join('')).join('')}
                </tbody>
              </table>
            </div>`;
        }

        

        return row;
    }

    async relationship() {
        if (Array.isArray(this.doc.questionarios) && this.doc.questionarios.length > 0) {
            const questionarioMap = {};
            this.questionarios.forEach(q => questionarioMap[q._key] = q);

            return `
            <div class="mt-5">
              <h4 class="mb-3">Questionários Associados:</h4>
              ${this.doc.questionarios.map(key => {
                  const q = questionarioMap[key];
                  const status = this.doc.statusQuestinarios?.[key] || 'não iniciado';
                  if (!q) {
                      return `
                        <div class="card mb-4 border-danger">
                          <div class="card-body text-danger">
                            Questionário não encontrado: ${key}
                          </div>
                        </div>`;
                  }
                  // badge
                  let badgeClass = 'bg-secondary';
                  if (status === 'não iniciado') badgeClass = 'bg-warning';
                  else if (status === 'em andamento') badgeClass = 'bg-primary';
                  else if (status === 'concluído') badgeClass = 'bg-success';

                  const questionCards = Array.isArray(q.questions)
                  ? `
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                      ${q.questions.map(qKey => {
                        const question = this.questions.find(qq => qq._key === qKey);
                        if (!question) {
                          return `<div class="col"><div class="alert alert-danger">Pergunta ${qKey} não encontrada.</div></div>`;
                        }
                        const alts = [question.alternative1, question.alternative2, question.alternative3, question.alternative4];
                        const idx = parseInt(question.correct, 10) - 1;
                        return `
                          <div class="col">
                            <div class="card h-100">
                              <div class="card-body">
                                <h6 class="card-title">${question.question}</h6>
                                <ul class="list-group list-group-flush">
                                  ${alts.map((alt, i) => `
                                    <li class="list-group-item ${i === idx ? 'bg-success text-white' : ''}">
                                      ${String.fromCharCode(65 + i)}) ${alt}
                                    </li>
                                  `).join("")}
                                </ul>
                              </div>
                            </div>
                          </div>`;
                      }).join("")}
                    </div>`
                  : `<div class="alert alert-warning">Sem perguntas.</div>`;
                

                  return `
                    <div class="card shadow-sm border-primary mb-4">
                      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <div><strong>${q.name}</strong></div>
                        <div>
                          <span class="badge ${badgeClass} me-2">${status}</span>
                          <a href="/Questionario/${q._key}" target="_blank" class="btn btn-info btn-sm">Acessar</a>
                        </div>
                      </div>
                      <div class="card-body">
                        <p>${q.description||'Sem descrição'}</p>
                        <ul class="list-group">
                          ${questionCards}
                        </ul>
                      </div>
                    </div>`;
              }).join("")}
            </div>`;
        }
        return `<div class="alert alert-info mt-4">Nenhum questionário associado.</div>`;
    }
}

window.SalvarPatient= async function() {
    let data = await copy();

    data.questionarios = formatToList(data.questionarios);

    console.log("Depois de formatar:", data);

    try {
        const url = data._key ? `/patient/${data._key}` : `/patient`;
        await save(url, data);
    } catch (err) {
        console.error("Erro ao salvar questionário:", err);
        alert("Erro ao salvar questionário.");
    }
};


