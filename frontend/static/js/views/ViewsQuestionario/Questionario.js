import AbstractView from "../AbstractView.js";

// Adiciona perguntas ao questionário
window.addQuestionToQuestionario = async function() {
    const questionarioKey = document.getElementById("Questionario_key").value;
    const selectedQuestion = document.getElementById("existingQuestions").value;

    if (!selectedQuestion) {
        alert("Selecione uma pergunta.");
        return;
    }

    try {
        await fetchData(`/Questionario/${questionarioKey}/add-question`, "POST", {
            question_key: selectedQuestion
        });

        alert("Pergunta adicionada com sucesso!");
        bootstrap.Modal.getInstance(document.getElementById("modalQuestion")).hide();
        location.reload();
    } catch (err) {
        alert("Erro ao adicionar pergunta.");
        console.error(err);
    }
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Cadastro de um novo Questionario");

        this.doc = {
            _key: "",
            name: "",
            description: "",
            status: "",
            questions: [],
            Person_key: ""
        };
        this.person = { _key: "", name: "" };
        this.questions = [];
        this.questionRelationship = [];
    }

    async getMenu() {
        return await this.StandardMenu('Questionario');
    }

    async init() {
        const _key = this.params._key;
        if (_key) {
            this.doc = await fetchData(`/Questionario/${_key}`, "GET");
            this.questions = await fetchData("/Question", "GET");
            this.questionRelationship = await fetchData(`/Questionario/${this.doc._key}/questions`, 'GET');

            // Carrega pessoa associada, se houver
            if (this.doc.Person_key) {
                this.person = await fetchData(`/person/${this.doc.Person_key}`, "GET");
                this.card = `
                    <div class="container mb-3">
                        Pessoa Associada: 
                        <a class="btn btn-info" href="/person/${this.person._key}">${this.person.name}</a>
                    </div>`;
            } else {
                this.card = ``;
            }
        }
    }

    getModal() {
        return `
        <div class="modal fade" id="modalQuestion" tabindex="-1" aria-labelledby="modalQuestionLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="modalQuestionLabel">Selecionar Pergunta</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
              </div>
              <div class="modal-body">
                <form id="formQuestionSelect">
                  <input type="hidden" id="Questionario_key" value="${this.doc._key}">
                  <div class="mb-3">
                    <label for="existingQuestions" class="form-label">Selecionar Pergunta Existente</label>
                    <select class="form-select" id="existingQuestions">
                      <option value="">Carregando perguntas...</option>
                    </select>
                  </div>
                  <div id="questionPreview" class="mt-4" style="display:none;"></div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="addQuestionToQuestionario()">Adicionar</button>
              </div>
            </div>
          </div>
        </div>`;
    }

    async getHtml() {
        let html = `
            <h2>Id do Questionario: ${this.doc._key}</h2>
            ${this.card || ''}
            <input type="hidden" class="aof-input" id="_key" value="${this.doc._key}">
            <div class="card mb-3">
              <div class="card-body">
                ${this.renderFormFields()}
              </div>
              <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary" onclick="SalvarQuestionario('/Questionario')">Salvar</button>
                ${this.doc._key ? `<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalQuestion">Adicionar Pergunta</button>` : ''}
              <//div>
            </div>
            ${this.doc._key ? this.getModal() : ''}
            ${this.doc._key ? await this.renderPerguntasSection() : ''}
        `;
        return html;
    }

    renderFormFields() {
        return `
            <div class="form-floating mb-2">
              <input class="form-control aof-input" type="text" id="name" value="${this.doc.name}" placeholder="name" required>
              <label for="name">Nome:</label>
            </div>
            <div class="form-floating mb-2">
              <input class="form-control aof-input" type="text" id="description" value="${this.doc.description}" placeholder="description" required>
              <label for="description">Descrição:</label>
            <//div>
            <div class="form-floating mb-2">
              <select class="form-select aof-input" id="status" required>
                <option value="1" ${this.doc.status==1?'selected':''}>Opção 1</option>
                <option value="2" ${this.doc.status==2?'selected':''}>Opção 2</option>
                <option value="3" ${this.doc.status==3?'selected':''}>Opção 3</option>
              </select>
              <label for="status">Status:</label>
            </div>
        `;
    }

    // Seção de perguntas com um único Accordion
    async renderPerguntasSection() {
        const list = this.questionRelationship || [];
        if (!list.length) {
            return `<div class="alert alert-info mt-4">Nenhuma pergunta associada.</div>`;
        }

        const accordionId = 'accordionPerguntas';
        const headerId = 'headingPerguntas';
        const collapseId = 'collapsePerguntas';

        // Cards de perguntas
        const cardsHtml = list.map(q => {
            const alts = [q.alternative1, q.alternative2, q.alternative3, q.alternative4];
            const idxAlt = parseInt(q.correct, 10) - 1;
            return `
            <div class="card mb-3">
              <div class="card-header bg-primary text-white">
                <strong>${q.question}</strong>
              </div>
              <ul class="list-group list-group-flush">
                ${alts.map((alt,i)=>`<li class="list-group-item ${i===idxAlt?'bg-success text-white':''}">${String.fromCharCode(65+i)}) ${alt}</li>`).join('')}
              </ul>
              <div class="card-footer text-end">
                <a href="/question/${q._key}" class="btn btn-sm btn-info" data-link>Ver Detalhes</a>
              </div>
            </div>`;
        }).join('');

        return `
        <div class="mt-5">
          <div class="accordion" id="${accordionId}">
            <div class="accordion-item">
              <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                  Perguntas Associadas
                </button>
              </h2>
              <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" data-bs-parent="#${accordionId}">
                <div class="accordion-body">
                  ${cardsHtml}
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }
}

window.SalvarQuestionario = async function(router) {
    let data = await copy();
    data.questions = formatToList(data.questions);
    try {
        const url = data._key ? `/Questionario/${data._key}` : `/Questionario`;
        await save(url, data);
        window.location.href = "/Questionario/list";
    } catch (err) {
        console.error("Erro ao salvar questionário:", err);
        alert("Erro ao salvar questionário.");
    }
};
