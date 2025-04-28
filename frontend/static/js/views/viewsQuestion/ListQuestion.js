import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Listagem de Perguntas");
    }

    async init() {
        this.list = await fetchData(`/question`, "GET");
    }

    async getMenu() {
        return await this.StandardMenu('question');
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="row mb-4 align-items-center">
                    <div class="col-md-6">
                        <h2 class="mb-0">Perguntas Cadastradas</h2>
                    </div>
                    <div class="col-md-6 text-end">
                        <span class="badge bg-primary">Total: ${this.list.length}</span>
                    </div>
                </div>

                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${this.list.length > 0 ? 
                        this.renderQuestions() : 
                        this.renderEmptyMessage()
                    }
                </div>
            </div>
        `;
    }

    renderQuestions() {
        return this.list.map(question => `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-light">
                        <h5 class="card-title mb-0">${question.question || "Sem enunciado"}</h5>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="card-text flex-grow-1">
                            <strong>A)</strong> ${question.alternative1}<br>
                            <strong>B)</strong> ${question.alternative2}<br>
                            <strong>C)</strong> ${question.alternative3}<br>
                            <strong>D)</strong> ${question.alternative4}
                        </p>
                        <p><strong>Correta:</strong> Alternativa ${question.correct}</p>
                        <div class="d-grid gap-2">
                            <a href="/question/${question._key}" 
                               class="btn btn-outline-primary" 
                               data-link>
                                <i class="bi bi-eye"></i> Ver Detalhes
                            </a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <small class="text-muted">ID: ${question._key}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderEmptyMessage() {
        return `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> Nenhuma pergunta encontrada.
                    <a href="/question/new" class="alert-link" data-link>
                        Clique aqui para criar uma nova.
                    </a>
                </div>
            </div>
        `;
    }
}
