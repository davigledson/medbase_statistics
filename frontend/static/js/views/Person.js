import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle("Cadastro de uma Pessoa");

        this.doc = {
            _key: "",
            name: ""
        };
    }

    async getMenu() {
        let row = `
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                    <a class="nav-link" href="/">JaofE</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" href="#">Nova Pessoa</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/person/list">Listar Pessoas</a>
                </li>
            </ul>
        `;
        return row;
    }

    async init() {
        const _key = this.params._key;
        this.users = await fetchData(`/user/`, "GET");
        console.log(this.users);

        this.list_users = this.users.map(user => `
            <li>${user.name}</li>
        `).join('');

        if (!!_key) {
            this.doc = await fetchData(`/person/${_key}`, "GET");
        }
    }

    async getHtml() {
        let row = `
            <input type="hidden" class="aof-input" id="_key" value="${this.doc._key}">
            <div class="card">            
                <div class="card-head"> 
                    <div class="form-floating">
                        <input class="form-control aof-input" type="text" value="${this.doc.name}"
                        autocomplete="off" id="name" placeholder="name" required>
                        <label for="name">Nome:</label>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary" onclick="saveForm('/person','/person/list');">
                        Salvar
                    </button>
                    ${this.doc._key ? `
                        <a href="/person/${this.doc._key}/Questionario" class="btn btn-outline-info mt-2" data-link>
                            Ver Questionario da Pessoa
                        </a>
                    ` : ''}
                </div>
            </div>

            <div class="card-head mt-3">
                Possíveis Usuários
                <ul>
                    ${this.list_users}
                </ul>
            </div>
        `;

        return row;
    }
}
