import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Listagem de Questionários");

        this.sortField = params.query?.sort || "name";
        this.sortOrder = params.query?.order || "asc";
        this.searchTerms = [];
    }

    async init() {
        this.list = await fetchData(`/questionnaire`, "GET");
        this.sortList();
        this.setupSearchEvents();
    }

    sortList() {
        const field = this.sortField;
        const order = this.sortOrder;
        this.list.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
            if (field === "_key") {
                valA = parseInt(valA, 10);
                valB = parseInt(valB, 10);
            } else {
                valA = (valA || "").toString().toLowerCase();
                valB = (valB || "").toString().toLowerCase();
            }
            if (valA < valB) return order === "asc" ? -1 : 1;
            if (valA > valB) return order === "asc" ? 1 : -1;
            return 0;
        });
    }

    async getMenu() {
        return await this.StandardMenu('questionnaire');
    }

    filterList() {
        if (this.searchTerms.length === 0) return this.list;
        return this.list.filter(q =>
            this.searchTerms.every(term =>
                q.name?.toLowerCase().includes(term.toLowerCase()) || q.description?.toLowerCase().includes(term.toLowerCase())
            )
        );
    }

    updateList() {
        const container = document.querySelector('.row.row-cols-1');
        if (!container) return;
        const filtered = this.filterList();
        container.innerHTML = filtered.length > 0
            ? this.renderQuestionarios(filtered)
            : this.renderEmptyMessage();
    }

    setupSearchEvents() {
        setTimeout(() => {
            const input = document.getElementById('searchInput');
            const pillsContainer = document.getElementById('pillsContainer');
            if (!input || !pillsContainer) return;

            input.addEventListener('input', () => {
                // split on whitespace
                const terms = input.value.trim().split(/\s+/).filter(t => t);
                this.searchTerms = terms;
                // update pills
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
                            // remove pill element
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
        const toggleOrder = this.sortOrder === "asc" ? "desc" : "asc";
        const currentSort = this.sortField;
        const currentOrder = this.sortOrder;

        return `
            <div class="container">
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" id="searchInput" class="form-control" placeholder="Buscar por nome...">
                    </div>
                </div>
                <div class="row mb-4" id="pillsContainer"></div>
                <div class="row mb-4 align-items-center">
                    <div class="col-md-6">
                        <h2 class="mb-0">Questionários Cadastrados</h2>
                    </div>
                    <div class="col-md-6 text-end d-flex flex-column align-items-end gap-2">
                        <div>
                            <span class="me-2">Ordenar por:</span>
                            <a href="/questionnaire/list?sort=name&order=${currentSort === "name" ? toggleOrder : "asc"}" data-link class="btn btn-sm ${currentSort === "name" ? "btn-primary" : "btn-outline-primary"}">
                                Nome ${currentSort === "name" ? (currentOrder === "asc" ? "↑" : "↓") : ""}
                            </a>
                            <a href="/questionnaire/list?sort=_key&order=${currentSort === "_key" ? toggleOrder : "asc"}" data-link class="btn btn-sm ${currentSort === "_key" ? "btn-primary" : "btn-outline-primary"}">
                                ID ${currentSort === "_key" ? (currentOrder === "asc" ? "↑" : "↓") : ""}
                            </a>
                        </div>
                        <span class="badge bg-primary">Total: ${this.list.length}</span>
                    </div>
                </div>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${this.filterList().length > 0 ? this.renderQuestionarios(this.filterList()) : this.renderEmptyMessage()}
                </div>
            </div>
        `;
    }

    renderQuestionarios(list) {
        return list.map(questionnaire => `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-light">
                        <h5 class="card-title mb-0">${questionnaire.name || "Questionário sem nome"}</h5>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <span class="badge ${this.getStatusBadgeClass(questionnaire.status)}">
                                ${questionnaire.status || "Sem status"}
                            </span>
                        </div>
                        <p class="card-text flex-grow-1">
                            ${questionnaire.description || "Nenhuma descrição disponível"}
                        </p>
                        <div class="d-grid gap-2">
                            <a href="/questionnaire/${questionnaire._key}" class="btn btn-outline-primary" data-link>
                                <i class="bi bi-eye"></i> Ver Detalhes
                            </a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <small class="text-muted">
                            ID: ${questionnaire._key}
                        </small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderEmptyMessage() {
        return `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> Nenhum questionário encontrado.
                    <a href="/questionnaire/new" class="alert-link" data-link>
                        Clique aqui para criar um novo.
                    </a>
                </div>
            </div>
        `;
    }

    getStatusBadgeClass(status) {
        switch(status) {
            case '1': return 'bg-success';
            case '2': return 'bg-warning text-dark';
            case '3': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }
}
