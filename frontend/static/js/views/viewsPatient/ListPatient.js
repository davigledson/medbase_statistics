import AbstractView from "../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Listagem de Pacientes");
    }

    async init() {
        this.list = await fetchData(`/patient`, "GET");
    }

    async getMenu() {
       
         return await this.NavBar()
        + await this.StandardMenu('patient','Paciente');
    }

    async getHtml() {
        return `
            <div class="container">
                <div class="row mb-4 align-items-center">
                    <div class="col-md-6">
                        <h2 class="mb-0">Pacientes Cadastrados</h2>
                    </div>
                    <div class="col-md-6 text-end">
                        <span class="badge bg-primary">Total: ${this.list.length}</span>
                    </div>
                </div>

                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${this.list.length > 0 ? 
                        this.renderPatients() : 
                        this.renderEmptyMessage()
                    }
                </div>
            </div>
        `;
    }

    renderPatients() {
        return this.list.map(patient => {
            const questionarios = Array.isArray(patient.questionnaires)
                ? patient.questionnaires.join(", ")
                : (patient.questionnaires || "Nenhum");
    
            return `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <div class="card-header bg-light">
                            <h5 class="card-title mb-0">${patient.name || "Sem nome"}</h5>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <p class="card-text flex-grow-1">
                                <strong>Descrição:</strong> ${patient.description || "Sem descrição"}<br>
                                <strong>Questionários:</strong> ${questionarios}
                            </p>
                            <div class="d-grid gap-2">
                                <a href="/patient/${patient._key}" 
                                   class="btn btn-outline-primary" 
                                   data-link>
                                    <i class="bi bi-eye"></i> Ver Detalhes
                                </a>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent">
                            <small class="text-muted">ID: ${patient._key}</small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    

    renderEmptyMessage() {
        return `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> Nenhum paciente encontrado.
                    <a href="/patient/new" class="alert-link" data-link>
                        Clique aqui para criar um novo.
                    </a>
                </div>
            </div>
        `;
    }
}
