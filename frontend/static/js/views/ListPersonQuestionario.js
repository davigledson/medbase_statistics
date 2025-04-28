import AbstractView from "./AbstractView.js";

// Função global para filtro
window.filterQuestionarios = function(personKey) {
    const status = document.getElementById("statusFilter").value;
    window.location.href = `/person/${personKey}/Questionario${status ? `?status=${status}` : ''}`;
};

// Função global para alternar cores
window.toggleColorIndicator = function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.toggle('no-color-indicator');
    });
    
    // Armazena preferência no sessionStorage
    //const isDisabled = document.querySelector('.card').classList.contains('no-color-indicator');
   // sessionStorage.setItem('colorIndicatorDisabled', isDisabled);
};

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Questionario da Pessoa");
        this.personKey = params._key;
        this.status = new URLSearchParams(window.location.search).get("status") || "";
        this.colorIndicatorDisabled = sessionStorage.getItem('colorIndicatorDisabled') === 'true';
    }

    async init() {
        const route = `/person/${this.personKey}/Questionario${this.status ? `?status=${this.status}` : ''}`;
        this.list = await fetchData(route, "GET");
        this.person = await fetchData(`/person/${this.personKey}`, "GET");
    }

    async getMenu() {
        return `
            <h1 class="text-center mt-4 mb-3">Questionario de ${this.person?.name || "Pessoa"}</h1>
            <ul class="nav nav-tabs justify-content-center mb-4">
                <li class="nav-item">
                    <a class="nav-link" href="/dashboard" data-link>JaofE</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/Questionario/new" data-link>Novo Questionario</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/Questionario/list" data-link>Listagem Geral</a>
                </li>
            </ul>
        `;
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="mb-0">Questionários</h2>
                    
                    <div class="d-flex align-items-center gap-2">
                        <div class="d-flex align-items-center">
                            <label for="statusFilter" class="form-label me-2 mb-0">Filtrar:</label>
                            <select id="statusFilter" class="form-select" style="width: 150px;">
                                <option value="">Todos os status</option>
                                <option value="1" ${this.status === "1" ? "selected" : ""}>Status 1</option>
                                <option value="2" ${this.status === "2" ? "selected" : ""}>Status 2</option>
                                <option value="3" ${this.status === "3" ? "selected" : ""}>Status 3</option>
                            </select>
                            <button class="btn btn-primary ms-2" onclick="filterQuestionarios('${this.personKey}')">
                                Aplicar
                            </button>
                        </div>
                        <button class="btn btn-primary" onclick="toggleColorIndicator()">
                            ${this.colorIndicatorDisabled ? 'Ativar' : 'Desativar'} Indicativo de Cores
                        </button>
                    </div>
                </div>

                <div class="row">
                    ${this.renderQuestionarios()}
                </div>
            </div>

            <style>
                .no-color-indicator {
                    border-color: #dee2e6 !important;
                }
            </style>
        `;
    }

    renderQuestionarios() {
        if (!this.list.length) {
            const message = this.status 
                ? `Nenhum questionário encontrado com status ${this.status}`
                : "Nenhum questionário encontrado para esta pessoa";
            
            return `
                <div class="col-12">
                    <div class="alert alert-info text-center">${message}</div>
                </div>
            `;
        }

        return this.list.map(element => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm ${this.colorIndicatorDisabled ? '' : this.getStatusClass(element.status)}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title">${element.name || "Questionario sem nome"}</h5>
                            <div class="d-flex flex-column justify-content-between align-items-start">
                                <small class="text-muted">Status ${element.status || "N/A"}</small>
                                <small class="text-muted">ID ${element._key || "N/A"}</small>
                            </div>
                        </div>
                        <p class="card-text mt-2">Tipo: ${element.Questionario || "Não especificado"}</p>
                        <div class="mt-auto pt-2">
                            <a href="/Questionario/${element._key}" class="btn btn-sm btn-outline-primary" data-link>
                                Ver Detalhes
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getStatusClass(status) {
        switch(status) {
            case '1': return 'border-success';
            case '2': return 'border-warning';
            case '3': return 'border-danger';
            default: return 'border-primary';
        }
    }

    async afterRender() {
        // Aplica o estado inicial das cores
        if (this.colorIndicatorDisabled) {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.classList.add('no-color-indicator');
            });
        }
    }
}