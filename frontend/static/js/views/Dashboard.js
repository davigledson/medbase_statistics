import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("JaofE");
        
    }

    async init() {
    }

    async getMenu() {
    let row = `
    <div class="container py-5 bg-light min-vh-100">
        <h1 class="mb-4 text-center fw-bold">Bem-vindo ao Jaofe 👽</h1>

        <div class="row g-4">

            <div class="col-md-6 col-xl-3">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-body text-center">
                  
                        <i class="bi bi-patch-question display-4 text-primary mb-3"></i>
                        <h5 class="card-title fw-semibold">Perguntas</h5>
                        <p class="card-text">Gerencie o cadastro de Perguntas.</p>
                        <a href="/question/list" class="btn btn-outline-primary w-100 mt-2" data-link>Ver Perguntas</a>
                        <a href="/question/new" class="btn btn-outline-primary w-100 mt-2" data-link>Nova Pergunta</a>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-body text-center">
                        <i class="bi bi-people-fill display-4 text-success mb-3"></i>
                        <h5 class="card-title fw-semibold">Usuários</h5>
                        <p class="card-text">Controle os usuários do sistema.</p>
                        <a href="/user/list" class="btn btn-outline-success w-100 mt-2" data-link>Ver Usuários</a>
                        <a href="/user/new" class="btn btn-outline-success w-100 mt-2" data-link>Novo Usuário</a>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-body text-center">
                        <i class="bi bi-ui-checks-grid display-4 text-warning mb-3"></i>
                        <h5 class="card-title fw-semibold">Questionários</h5>
                        <p class="card-text">Crie e gerencie questionários.</p>
                        <a href="/questionnaire/list" class="btn btn-outline-warning w-100 mt-2" data-link>Ver Questionários</a>
                        <a href="/questionnaire/new" class="btn btn-outline-warning w-100 mt-2" data-link>Novo Questionário</a>
                        <a href="/question/list" class="btn btn-outline-warning w-100 mt-2" data-link>Listar Perguntas</a>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-xl-3">
                <div class="card shadow-sm border-0 h-100">
                    <div class="card-body text-center">
                        <i class="bi bi-heart-pulse-fill display-4 text-danger mb-3"></i>
                        <h5 class="card-title fw-semibold">Pacientes</h5>
                        <p class="card-text">Cadastre e acompanhe pacientes.</p>
                        <a href="/patient/list" class="btn btn-outline-danger w-100 mt-2" data-link>Ver Pacientes</a>
                        <a href="/patient/new" class="btn btn-outline-danger w-100 mt-2" data-link>Novo Paciente</a>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `
    return row;
}

}