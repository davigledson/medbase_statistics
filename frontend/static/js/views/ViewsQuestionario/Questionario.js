import AbstractView from "../AbstractView.js";


//salvar as perguntas relacionadas ao questionario no modal
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
            questions:[],
            
            "Person_key": ""
        };
        this.person = {
            _key: "",
            name: "",
        };
    }

    async getMenu() {
        return await this.StandardMenu('Questionario');
    }

    async init() {
        const _key = this.params._key;

        if (!!_key) {
            this.doc = await fetchData(`/Questionario/${_key}`, "GET");
            console.log(this.doc)
           
            this.questions = await fetchData("/Question", "GET");
            this.person_associate = await this.doc["Person:_key"];

            if (this.person_associate) {
                this.person = await fetchData(`/person/${this.person_associate}`, "GET");
                this.card = `
                    <div class="container">
                        Pessoa Associada: 
                        <a class="btn btn-info" href="${this.person_associate}">${this.person.name}</a>
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
        </div>
        `;
    }
    
    
    async getHtml() {
        let row = `
        <h2>Id do Questionario: ${this.doc._key}</h2>
        <h2>Pessoa associada: ${this.doc.Person_key}</h2>
    
        <input type="hidden" class="aof-input" id="_key" value="${this.doc._key}">
        <div class="card">            
            <div class="card-head"> 
                <input type="hidden" class="aof-input" id="Person_key" value="${this.doc.Person_key || ''}">
<input type="hidden" id="questions" class="aof-input"  value='${this.doc.questions}'>


    
                <div class="form-floating">
                    <input class="form-control aof-input" type="text" value="${this.doc.name}" autocomplete="off" id="name" placeholder="name" required>
                    <label for="name">Nome:</label>
                </div>
    
                <div class="form-floating">
                    <input class="form-control aof-input" type="text" value="${this.doc.description}" autocomplete="off" id="description" placeholder="description" required>
                    <label for="description">Descrição:</label>
                </div>
    
                <div class="form-floating">
                    <select class="form-select aof-input" id="status" required>
                        <option value="1" ${this.doc.status == 1 ? 'selected' : ''}>Opção 1</option>
                        <option value="2" ${this.doc.status == 2 ? 'selected' : ''}>Opção 2</option>
                        <option value="3" ${this.doc.status == 3 ? 'selected' : ''}>Opção 3</option>
                    </select>
                    <label for="status">Status:</label>
                </div>
            </div>
    
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-primary" onclick="SalvarQuestionario('/Questionario')">Salve</button>
                ${this.doc._key ? `
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalQuestion">
                        Adicionar Pergunta
                    </button>` : ''
                }
            </div>
        </div>
    
        ${this.doc._key ? this.getModal() : ''}
        `;
    
        // Após renderizar, configurar carregamento das perguntas
        setTimeout(() => {
            const modalEl = document.getElementById("modalQuestion");
            const select = document.getElementById("existingQuestions");
            const preview = document.getElementById("questionPreview");
            let allQuestions = [];
        
            if (modalEl) {
                modalEl.addEventListener("show.bs.modal", async () => {
                    try {
                        const questions = this.questions;
                        allQuestions = questions;
                        select.innerHTML = '<option value="">Selecione uma pergunta</option>';
        
                        questions.forEach(q => {
                            const option = document.createElement("option");
                            option.value = q._key;
                            option.textContent = q.question || `(Pergunta ${q._key})`;
                            select.appendChild(option);
                        });
        
                        preview.innerHTML = "";
                        preview.style.display = "none";
                    } catch (err) {
                        select.innerHTML = '<option value="">Erro ao carregar perguntas</option>';
                    }
                });
        
                select.addEventListener("change", () => {
                    const selected = allQuestions.find(q => q._key === select.value);
                    if (!selected) {
                        preview.style.display = "none";
                        preview.innerHTML = "";
                        return;
                    }
        
                    const alternativas = [
                        selected.alternative1,
                        selected.alternative2,
                        selected.alternative3,
                        selected.alternative4
                    ];
                    const corretaIndex = parseInt(selected.correct, 10) - 1;
        
                    preview.innerHTML = `
                        <div class="card shadow-sm border-primary">
                            <div class="card-header bg-primary text-white">
                                <strong>Pergunta:</strong> ${selected.question}
                            </div>
                            <ul class="list-group list-group-flush">
                                ${alternativas.map((alt, idx) => `
                                    <li class="list-group-item ${corretaIndex === idx ? 'bg-success text-white' : ''}">
                                        ${String.fromCharCode(65 + idx)}) ${alt}
                                    </li>
                                `).join("")}
                            </ul>
                        </div>
                    `;
                    preview.style.display = "block";
                });
            }
        }, 0);
        
    
        return row;
    }
    async relationship() {
        console.log("Document loaded:", this.doc); // Verifique o conteúdo de this.doc
    
        if (this.doc.questions && this.doc.questions.length > 0) {
            const allQuestions = this.questions;
            console.log("All questions loaded:", allQuestions); // Verifique todas as perguntas carregadas
    
            const questionMap = {};
            allQuestions.forEach(q => questionMap[q._key] = q);
    
            return `
                <div class="mt-5">
                    <h4 class="mb-3">Perguntas Associadas:</h4>
                    ${this.doc.questions.map(key => {
                        console.log("Looking for question with key:", key); // Log da chave da pergunta
                        const q = questionMap[key];
                        if (!q) {
                            console.log("Question not found:", key); // Log se a pergunta não for encontrada
                            return `
                                <div class="card mb-4 border-danger">
                                    <div class="card-body text-danger">
                                        Pergunta não encontrada: ${key}
                                    </div>
                                </div>
                            `;
                        }
    
                        const alternativas = [
                            q.alternative1,
                            q.alternative2,
                            q.alternative3,
                            q.alternative4
                        ];
    
                        const corretaIndex = parseInt(q.correct, 10) - 1;
    
                        return `
                            <div class="card shadow-sm border-primary mb-4">
                                <div class="card-header bg-primary text-white d-flex justify-content-between">
            <div class="d-flex align-items-center">
                           <strong class="me-2">Pergunta: </strong> ${q.question}

            </div>
            <div class="d-flex align-items-center">
                <small class="text-white mr-2 me-3">ID: ${q._key}</small>
                <a href="/question/${q._key}" class="btn btn-info btn-sm text-white" target="_blank">Acessar</a>
            </div>
        </div>
                                <ul class="list-group list-group-flush">
                                    ${alternativas.map((alt, idx) => `
                                        <li class="list-group-item ${corretaIndex === idx ? 'bg-success text-white' : ''}">
                                            ${String.fromCharCode(65 + idx)}) ${alt}
                                        </li>
                                    `).join("")}
                                </ul>
                            </div>
                        `;
                    }).join("")}
                </div>
            `;
        }
    
        return ""; // Se não houver perguntas, não exibe nada
    }
    

    
    
}

window.SalvarQuestionario = async function(router) {
    let data = await copy();

    data.questions = formatToList(data.questions);

    console.log("Depois de formatar:", data);

    try {
        const url = data._key ? `/Questionario/${data._key}` : `/Questionario`;
        await save(url, data);
    } catch (err) {
        console.error("Erro ao salvar questionário:", err);
        alert("Erro ao salvar questionário.");
    }
};
