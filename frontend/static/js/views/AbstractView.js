export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }

    async init() {   }

    async getMenu() {
        return "";
    }

    async getWidget () {
        return "";
    }
   
     
    
    

    async StandardMenu(name = "") {
     
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(part => part !== '');
        
        // ver qual item deve estar ativo
        const isDashboard = currentPath === '/dashboard';
        const isNew = currentPath === `/${name}/new`;
        const isDetail = pathParts.length === 2 && 
                       pathParts[0] === name && 
                       !isNaN(pathParts[1]);
        const isList = !isDashboard && !isNew && !isDetail && 
                      (currentPath === `/${name}/list` || 
                       currentPath === `/${name}` || 
                       (currentPath.startsWith(`/${name}/`) && currentPath !== `/${name}/new`));
        
        
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        
      
        let title;
        if (isDetail) {
            title = `Detalhes do ${formattedName} ${pathParts[1]}`;
        } else if (isNew) {
            title = `Cadastrar Novo ${formattedName}`;
        } else if (isList) {
            title = `Listagem de ${formattedName}`;
        } else if (isDashboard) {
            title = `Dashboard`;
        } else {
            title = `${formattedName}`;
        }
        
        return `
            <h1 class="text-center my-4">${title}</h1>
            <ul class="nav nav-tabs justify-content-center mb-4">
                <li class="nav-item">
                    <a class="nav-link ${isDashboard ? 'active' : ''}" href="/dashboard" data-link>
                        <i class="bi bi-house-door"></i> Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${isNew ? 'active' : ''}" href="/${name}/new" data-link>
                        <i class="bi bi-plus-circle"></i> Novo ${formattedName}
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${isList ? 'active' : ''}" href="/${name}/list" data-link>
                        <i class="bi bi-list-ul"></i> Listagem
                    </a>
                </li>
            </ul>
        `;
    }
    //mostrar as relaçoes: ex: um questionario tem varias perguntas
    async relationship() {
        return "";
    }
}