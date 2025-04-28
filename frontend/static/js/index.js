import Dashboard from "./views/Dashboard.js";
import ListPerson from "./views/ListPerson.js";
import Person from "./views/Person.js";
import User from "./views/User.js";
import ListUser from "./views/ListUser.js";
import Questionario from "./views/ViewsQuestionario/Questionario.js";
import ListQuestionario from "./views/ViewsQuestionario/ListQuestionario.js";
import ListPersonQuestionario from "./views/ListPersonQuestionario.js";
import ListQuestionarioPerson from "./views/ViewsQuestionario/ListQuestionarioPerson.js";

import Question from "./views/viewsQuestion/Question.js";
import ListQuestion from "./views/viewsQuestion/ListQuestion.js";

import Patient from "./views/viewsPatient/Patient.js";
import ListPatient from "./views/viewsPatient/ListPatient.js";

// Modificado para ignorar query string na comparação de rotas
const pathToRegex = path => {
    const pathWithoutQuery = path.split('?')[0];
    return new RegExp("^" + pathWithoutQuery.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "(\\?.*)?$");
};

// Modificado para preservar a query string
const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    
    // Extrai os parâmetros da rota
    const routeParams = Object.fromEntries(keys.map((key, i) => [key, values[i]]));
    
    // Extrai os parâmetros da query string
    const queryParams = {};
    const url = new URL(window.location.href);
    url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });
    
    return {
        ...routeParams,
        query: queryParams
    };
};

// Modificado para preservar a query string na navegação
const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/dashboard", view: Dashboard },

        { path: "/person/new", view: Person },
        { path: "/person/list", view: ListPerson },
        { path: "/person/:_key", view: Person },
        { path: "/person/:_key/Questionario", view: ListPersonQuestionario },

        { path: "/user/new", view: User },
        { path: "/user/list", view: ListUser },
        { path: "/user/:_key", view: User },

        { path: "/Questionario/new", view: Questionario },
        { path: "/Questionario/list", view: ListQuestionario },
        { path: "/Questionario/:_key", view: Questionario },
        { path: "/Questionario/:_key/person/:personKey", view: Questionario },
        { path: "/Questionario/:_key/person", view: ListQuestionarioPerson },

        { path: "/question/new", view: Question },
        { path: "/question/list", view: ListQuestion },
        { path: "/question/:_key", view: Question },

        { path: "/patient/new", view: Patient },
        { path: "/patient/list", view: ListPatient },
        { path: "/patient/:_key", view: Patient },

        { path: "/", view: Dashboard },
    ];

    // Obtém o path sem a query string para comparação
    const currentPath = window.location.pathname;

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: currentPath.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [currentPath]
        };
    }

    // Passa tanto os parâmetros da rota quanto da query string
    const params = getParams(match);
    const view = new match.route.view(params);

    await view.init();
    document.querySelector("#menu").innerHTML = await view.getMenu();
    document.querySelector("#app").innerHTML = await view.getHtml();
    
     const html = await view.getHtml();
     const related = view.relationship ? await view.relationship() : "";
 
     document.querySelector("#app").innerHTML = html + related;
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const link = e.target.closest("[data-link]");
        if (link) {
            e.preventDefault();
            navigateTo(link.href);
        }
    });

    router();
});