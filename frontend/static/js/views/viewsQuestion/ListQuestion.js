import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Listagem de Perguntas");
        this.searchTerms = [];
    }

    async init() {
        this.list = await fetchData(`/question`, "GET");
        this.setupSearchEvents();
    }

    async getMenu() {
        return await this.StandardMenu('question');
    }

    filterList() {
        if (this.searchTerms.length === 0) return this.list;
        return this.list.filter(q =>
            this.searchTerms.every(term =>
                q.question?.toLowerCase().includes(term.toLowerCase()) 
                
                ||   q.alternative1?.toLowerCase().includes(term.toLowerCase())
                ||   q.alternative2?.toLowerCase().includes(term.toLowerCase())
                ||   q.alternative3?.toLowerCase().includes(term.toLowerCase())
                ||   q.alternative4?.toLowerCase().includes(term.toLowerCase())
            )
        );
    }

    updateList() {
        const container = document.querySelector('.row.row-cols-1');
        if (!container) return;
        const filtered = this.filterList();
        container.innerHTML = filtered.length > 0
            ? this.renderQuestions(filtered)
            : this.renderEmptyMessage();
    }

    setupSearchEvents() {
        setTimeout(() => {
            const input = document.getElementById('searchInput');
            const pillsContainer = document.getElementById('pillsContainer');
            if (!input || !pillsContainer) return;

            input.addEventListener('input', () => {
                const terms = input.value.trim().split(/\s+/).filter(t => t);
                this.searchTerms = terms;
                pillsContainer.innerHTML = '';
                this.searchTerms.forEach(term => {
                    const pillId = `pill-${term.replace(/\s+/g, '_')}`;
                    insertOnePill(
                        'pillsContainer',
                        pillId,
                        term,
                        () => {},
                        () => {},
                        (id, val) => {
                            this.searchTerms = this.searchTerms.filter(t => t !== val);
                            input.value = this.searchTerms.join(' ');
                            this.updateList();
                            const el = document.getElementById(id);
                            if (el) el.remove();
                        }
                    );
                });
                this.updateList();
            });
        }, 0);
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" id="searchInput" class="form-control" placeholder="Buscar por enunciado...">
                    </div>
                </div>
                <div class="row mb-4" id="pillsContainer"></div>
                <div class="row mb-4 align-items-center">
                    <div class="col-md-6">
                        <h2 class="mb-0">Perguntas Cadastradas</h2>
                    </div>
                    <div class="col-md-6 text-end">
                        <span class="badge bg-primary">Total: ${this.list.length}</span>
                    </div>
                </div>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${this.filterList().length > 0 ? this.renderQuestions(this.filterList()) : this.renderEmptyMessage()}
                </div>
            </div>
        `;
    }

    renderQuestions(list) {
        return list.map(question => `
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
                            <a href="/question/${question._key}" class="btn btn-outline-primary" data-link>
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
