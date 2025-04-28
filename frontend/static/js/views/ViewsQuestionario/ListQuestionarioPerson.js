import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Pessoas do Questionário");
        this.questionarioKey = params._key;
    }

    async init() {
        // Carrega o questionário e as pessoas relacionadas em paralelo
        const [questionario, pessoas] = await Promise.all([
            fetchData(`/Questionario/${this.questionarioKey}`, "GET"),
            fetchData(`/Questionario/${this.questionarioKey}/person`, "GET")
        ]);
        
        this.questionario = questionario;
        this.pessoas = pessoas;
    }

    async getMenu() {
        return `
            <h1 class="text-center mt-4 mb-3">Pessoas do Questionário</h1>
            <ul class="nav nav-tabs justify-content-center mb-4">
                <li class="nav-item">
                    <a class="nav-link" href="/dashboard" data-link>JaofE</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/Questionario/list" data-link>Todos Questionários</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/Questionario/${this.questionarioKey}" data-link>
                        Voltar ao Questionário
                    </a>
                </li>
            </ul>
        `;
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <div class="d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">${this.questionario.name || "Questionário Sem Nome"}</h4>
                            <span class="badge ${this.getStatusBadgeClass(this.questionario.status)}">
                                ${this.getStatusText(this.questionario.status)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <h5 class="card-title mb-4">
                            <i class="bi bi-people-fill"></i> Pessoas Relacionadas
                            <span class="badge bg-secondary ms-2">${this.pessoas.length}</span>
                        </h5>
                        
                        ${this.pessoas.length > 0 ? 
                            this.renderPeopleCards() : 
                            '<div class="alert alert-info">Nenhuma pessoa vinculada</div>'
                        }
                    </div>
                </div>
            </div>
        `;
    }

    renderPeopleCards() {
        return `
            <div class="row row-cols-1 row-cols-md-2 g-4">
                ${this.pessoas.map(pessoa => `
                    <div class="col">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">
                                    ${pessoa.name || "Nome não informado"}
                                </h5>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">ID: ${pessoa._key}</small>
                                    <a href="/person/${pessoa._key}" 
                                       class="btn btn-sm btn-outline-primary" 
                                       data-link>
                                        Ver Detalhes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getStatusBadgeClass(status) {
        const classes = {
            '1': 'bg-success',
            '2': 'bg-warning text-dark',
            '3': 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    getStatusText(status) {
        const texts = {
            '1': 'Ativo',
            '2': 'Pendente',
            '3': 'Inativo'
        };
        return texts[status] || 'Status Desconhecido';
    }
}