import AbstractView from "../AbstractView.js";

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle("Cadastro de uma nova Pergunta");

        this.doc = {
            _key: "",
            question: "",
            alternative1: "",
            alternative2: "",
            alternative3: "",
            alternative4: "",
            correct: "",
            "Questionario:_key": ""
        };
    }

    async getMenu() {
        return await this.StandardMenu('question');
    }

    async init() {
        const _key = this.params._key;

        if (!!_key) {
            this.doc = await fetchData(`/question/${_key}`, "GET");
        }
    }

    async getHtml() {
        return `
            <h2>ID da Pergunta: ${this.doc._key}</h2>
            <input type="hidden" class="aof-input" id="_key" value="${this.doc._key}">
            <input type="hidden" class="aof-input" id="Questionario:_key" value="${this.doc["Questionario:_key"] || ''}">

            <div class="card">
                <div class="card-head">
                    <div class="form-floating mb-2">
                        <input class="form-control aof-input" type="text" id="question" value="${this.doc.question}" placeholder="Pergunta" required>
                        <label for="question">Pergunta:</label>
                    </div>

                    <div class="form-floating mb-2">
                        <input class="form-control aof-input" type="text" id="alternative1" value="${this.doc.alternative1}" placeholder="Alternativa A" required>
                        <label for="alternative1">Alternativa A:</label>
                    </div>

                    <div class="form-floating mb-2">
                        <input class="form-control aof-input" type="text" id="alternative2" value="${this.doc.alternative2}" placeholder="Alternativa B" required>
                        <label for="alternative2">Alternativa B:</label>
                    </div>

                    <div class="form-floating mb-2">
                        <input class="form-control aof-input" type="text" id="alternative3" value="${this.doc.alternative3}" placeholder="Alternativa C" required>
                        <label for="alternative3">Alternativa C:</label>
                    </div>

                    <div class="form-floating mb-2">
                        <input class="form-control aof-input" type="text" id="alternative4" value="${this.doc.alternative4}" placeholder="Alternativa D" required>
                        <label for="alternative4">Alternativa D:</label>
                    </div>

                    <div class="form-floating mb-2">
                        <select class="form-select aof-input" id="correct" required>
                            <option value="1" ${this.doc.correct == "1" ? "selected" : ""}>Alternativa A</option>
                            <option value="2" ${this.doc.correct == "2" ? "selected" : ""}>Alternativa B</option>
                            <option value="3" ${this.doc.correct == "3" ? "selected" : ""}>Alternativa C</option>
                            <option value="4" ${this.doc.correct == "4" ? "selected" : ""}>Alternativa D</option>
                        </select>
                        <label for="correct">Alternativa Correta:</label>
                    </div>
                </div>

                <div class="card-footer d-flex">
                    <button class="btn btn-primary" onclick="saveForm('/question', '/question/list')">Salvar</button>
                </div>
            </div>
        `;
    }

    async relationship() { 
        if (this.doc["Questionario:_key"]) {
            const questionario = await fetchData(`/Questionario/${this.doc["Questionario:_key"]}`, "GET");
    
            return `
                <div class="mt-4">
                    <h4>Questionário Relacionado:</h4>
                    <div class="card shadow-sm border-info mb-3" style="max-width: 30rem;">
                        <div class="card-header bg-info text-white">
                            <strong>${questionario.name}</strong>
                        </div>
                        <div class="card-body">
                            <p class="card-text">${questionario.description || 'Sem descrição'}</p>
                            <a href="/Questionario/${questionario._key}" class="btn btn-outline-info" data-link>
                                Ver Questionário
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
    
        return "";
    }
    
    
}
