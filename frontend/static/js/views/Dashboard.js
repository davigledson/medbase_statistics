import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("JaofE");
        
    }

    async init() {
    }

    async getHtml() {
        
        let row = `
        
            <div class="card" style="border-top: none;">
                <div class="card-header">
                </div>                
                <div class="card-body">
                
                </div>
            </div>`
            //<img onload="showStatus('/status/contract')" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" >`

        return row;

    }

    async getMenu() {

        let row = `
            <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                    <a class="nav-link active" href="#">JaofE</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/person/new">Nova Pessoa</a>
                </li>
                
                <li class="nav-item">
                    <a class="nav-link" href="/person/list">Listar Pessoas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/user/new">Novo Usuario</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="/user/list">Listagem de Usuarios</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="/questionnaire/new">criar Questionario</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="/questionnaire/list">Listagem de Questionario</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="/question/list">Listagem de Perguntas</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" href="/patient/new">criar Paciente</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="/patient/list">Listagem de Paciente</a>
                </li>

                
                
            </ul>
            `
        return row; 
    }




}