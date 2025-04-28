import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Listagem de Questionários");

        this.sortField = params.query?.sort || "name";  // name ou _key
        this.sortOrder = params.query?.order || "asc";  // asc ou desc
    }

    async init() {
        this.list = await fetchData(`/Questionario`, "GET");
        this.sortList();
    }

    //ESSA MESMA FUNÇÃO ESTAR NO BACK-END (VERIFICAR DEPOIS - DUPLICAÇÃO -DATACONTROL)
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
        return await this.StandardMenu('Questionario');
    }

    async getHtml() {
        const toggleOrder = this.sortOrder === "asc" ? "desc" : "asc";
        const currentSort = this.sortField;
        const currentOrder = this.sortOrder;

        return `
            <div class="container">
                <div class="row mb-4 align-items-center">
                    <div class="col-md-6">
                        <h2 class="mb-0">Questionários Cadastrados</h2>
                    </div>
                    <div class="col-md-6 text-end d-flex flex-column align-items-end gap-2">
                        <div>
                            <span class="me-2">Ordenar por:</span>
                            <a href="/Questionario/list?sort=name&order=${currentSort === "name" ? toggleOrder : "asc"}" 
                               data-link 
                               class="btn btn-sm ${currentSort === "name" ? "btn-primary" : "btn-outline-primary"}">
                                Nome ${currentSort === "name" ? (currentOrder === "asc" ? "↑" : "↓") : ""}
                            </a>
                            <a href="/Questionario/list?sort=_key&order=${currentSort === "_key" ? toggleOrder : "asc"}" 
                               data-link 
                               class="btn btn-sm ${currentSort === "_key" ? "btn-primary" : "btn-outline-primary"}">
                                ID ${currentSort === "_key" ? (currentOrder === "asc" ? "↑" : "↓") : ""}
                            </a>
                        </div>
                        <span class="badge bg-primary">Total: ${this.list.length}</span>
                    </div>
                </div>

                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${this.list.length > 0 ? 
                        this.renderQuestionarios() : 
                        this.renderEmptyMessage()
                    }
                </div>
            </div>
        `;
    }

    renderQuestionarios() {
        return this.list.map(questionario => `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-light">
                        <h5 class="card-title mb-0">${questionario.name || "Questionário sem nome"}</h5>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <span class="badge ${this.getStatusBadgeClass(questionario.status)}">
                                ${questionario.status || "Sem status"}
                            </span>
                        </div>
                        <p class="card-text flex-grow-1">
                            ${questionario.description || "Nenhuma descrição disponível"}
                        </p>
                        <div class="d-grid gap-2">
                            <a href="/Questionario/${questionario._key}" 
                               class="btn btn-outline-primary" 
                               data-link>
                                <i class="bi bi-eye"></i> Ver Detalhes
                            </a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <small class="text-muted">
                            ID: ${questionario._key}
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
                    <a href="/Questionario/new" class="alert-link" data-link>
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
