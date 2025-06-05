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
   
     
    

    async NavBar() {
     
    
        return `
           <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm rounded-bottom">
            <div class="container-fluid">

                <button 
                    class="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" 
                    aria-expanded="false"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">

                    <li class="nav-item">
                            <a 
                                class="nav-link  text-white" 
                                href="/" 
                                role="button"
                                d
                                aria-expanded="false"
                            >
                                <i class="bi bi-speedometer me-1"></i>Dashboard
                            </a>
                            
                        </li>

                        <li class="nav-item dropdown">
                            <a 
                                class="nav-link dropdown-toggle text-white" 
                                href="#" 
                                role="button"
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <i class="bi bi-patch-question me-1"></i>Perguntas
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="/question/new" data-link>
                                        <i class="bi bi-question-lg me-1"></i>Nova Pergunta
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="/question/list" data-link>
                                        <i class="bi-patch-question me-1"></i>Listar Perguntas
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li class="nav-item dropdown">
                            <a 
                                class="nav-link dropdown-toggle text-white" 
                                href="#" 
                                role="button"
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <i class="bi bi-people-fill me-1"></i>Usuários
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="/user/new" data-link>
                                        <i class="bi bi-person-fill-add me-1"></i>Novo Usuário
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="/user/list" data-link>
                                        <i class="bi bi-people-fill me-1"></i>Listar Usuários
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li class="nav-item dropdown">
                            <a 
                                class="nav-link dropdown-toggle text-white" 
                                href="#" 
                                role="button"
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <i class="bi bi-ui-checks-grid me-1"></i>Questionários
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="/questionnaire/new" data-link>
                                        <i class="bi bi-ui-checks-grid me-1"></i>Criar Questionário
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="/questionnaire/list" data-link>
                                        <i class="bi bi-list-task me-1"></i>Listar Questionários
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="/question/list" data-link>
                                        <i class="bi bi-question-circle-fill me-1"></i>Listar Perguntas
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li class="nav-item dropdown">
                            <a 
                                class="nav-link dropdown-toggle text-white" 
                                href="#" 
                                role="button"
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <i class="bi bi-heart-pulse-fill me-1"></i>Pacientes
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="/patient/new" data-link>
                                        <i class="bi bi-person-hearts me-1"></i>Criar Paciente
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="/patient/list" data-link>
                                        <i class="bi bi-heart-pulse-fill me-1"></i>Listar Pacientes
                                    </a>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
        `;
    }

    async StandardMenu(route = "",label="") {
     
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(part => part !== '');
        
        // ver qual item deve estar ativo
        const isDashboard = currentPath === '/dashboard';
        const isNew = currentPath === `/${route}/new`;
        const isDetail = pathParts.length === 2 && 
                       pathParts[0] === route && 
                       !isNaN(pathParts[1]);
        const isList = !isDashboard && !isNew && !isDetail && 
                      (currentPath === `/${route}/list` || 
                       currentPath === `/${route}` || 
                       (currentPath.startsWith(`/${route}/`) && currentPath !== `/${route}/new`));
        
        
        const formattedName = label.charAt(0).toUpperCase() + label.slice(1);
        
      
        let title;
        if (isDetail) {
            title = `Detalhes do ${formattedName} ${pathParts[1]}`;
        } else if (isNew) {
            title = `Cadastrar Novo(a) ${formattedName}`;
        } else if (isList) {
            title = `Listagem de ${formattedName}s`;
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
                    <a class="nav-link ${isNew ? 'active' : ''}" href="/${route}/new" data-link>
                        <i class="bi bi-plus-circle"></i> Novo ${formattedName}
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${isList ? 'active' : ''}" href="/${route}/list" data-link>
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