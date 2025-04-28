import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(params) {
        super(params);
        this.setTitle("Cadastro de um Usuario");

        this.doc = {
            _key:"",
            name:"",
            "Person_key": "" 
        };
       this.person = {
            _key:"",
            name:"",
       }

    }

    async getMenu() {

        let row = `  <h1>USUARIOS</h1>
                <ul class="nav nav-tabs justify-content-center">
                    <li class="nav-item">
                        <a class="nav-link" href="/">JaofE</a>
                    </li>
                    
                    <li class="nav-item">
                    <a class="nav-link active" href="/user/new">Novo Usuarios</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link " href="/user/list">Listagem de Usuarios</a>
                </li>
            </ul>
            `
        return row;
    }

    async init() {

        const _key = this.params._key;
        if(!!_key) {

            this.doc = await fetchData(`/user/${_key}`,"GET");
            this.person_associate = await this.doc["Person:_key"];
            

            if(this.person_associate){
                this.person = await fetchData(`/person/${this.person_associate}`,"GET");
               this.card =  `<div class="container">
            Pessoa Associada: 
            <a class="btn btn-info " href="${this.person_associate}">${this.person.name}</a>
            </div> `; 
            } else {
                this.card = ``;
            }
            
            console.log(this.doc);
            console.log(this.person);

          
        } 
                                    
    }
    
    async getHtml() {

        let row = ``

        row += `
        <input type="hidden" class="aof-input" id="_key" value="${this.doc._key}">
        <div class="card">            
            <div class="card-head"> 
                <div class="form-floating">
                    <input class="form-control aof-input" type="text" value="${this.doc.name}"
                    autocomplete="off" id="name" placeholder="name" required>
                    <label for="name">Nome:</label>
                </div>
            </div>
            <div class="card-footer d-flex ">
                <button class="btn btn-primary" onclick="saveForm('/user','/user/list')">Salve</button>
                 `+this.card + `
                
                
            </div>
            </div>
                
        </div>
        
        `


        return row;
    }
}