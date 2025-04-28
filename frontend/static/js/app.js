const server = "http://localhost:3000";

function removeElement(id, ref_element) {

    const element = document.getElementById(id);
  
    const target_element = document.getElementById(ref_element);
  
    target_element.removeChild(element)
}
  
function insertOnePill(target_element_id, pill_id, pill_value, call_finish, call_select, call_remove, buttonClass) {

    const target_element = document.getElementById(target_element_id);
    if (buttonClass == undefined) {
        buttonClass = "btn-primary"
    }
    buttonClass = `btn btn-sm btn-primary ${pill_value.replace(" ", "")} ${buttonClass}`
    let new_element = `
        <div class="btn-group">
            <input type="hidden" value="${pill_value}">
            <button type="button" class="${buttonClass}">${pill_value}</button>
            <button type="button" class="btn btn-sm aof-remove">X</button>
        </div>
    `
    const b = document.createElement("span")
    b.id = pill_id;
    b.innerHTML = new_element;

    b.getElementsByClassName(buttonClass)[0].addEventListener("click", function () {
        call_select(pill_id,pill_value)
    });

    b.getElementsByClassName("aof-remove")[0].addEventListener("click", function () {
        call_remove(pill_id,pill_value)
    });

    target_element.appendChild(b)

    call_finish();

}

//formatar campos 1,2 para ["1","2"]
function formatToList(value) {
    if (!Array.isArray(value)) {
        const raw = String(value ?? "").trim();

        if (raw === "" || raw === "undefined") {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed)
                ? parsed.map(q => String(q).trim())
                : [String(parsed).trim()];
        } catch (e) {
            return raw
                .split(/[\s,|;]+/)
                .map(q => q.trim())
                .filter(q => q !== "" && q !== "undefined");
        }
    }

    return value
        .map(q => String(q).trim())
        .filter(q => q !== "" && q !== "undefined");
}

function formatDate(date) {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    return formattedDate;
}

function modalSelect({ id, id_key, label, items = [], saveFunction }) {
    const modalId = `modal${id}`;
    const selectId = `existing${id}s`;
    const saveBtnId = `saveBtn${id}`;

    setTimeout(() => {
        const modalEl = document.getElementById(modalId);
        const select = document.getElementById(selectId);
        const saveBtn = document.getElementById(saveBtnId);

        if (modalEl && select) {
            modalEl.addEventListener("show.bs.modal", () => {
                select.innerHTML = `<option value="">Selecione um ${label.toLowerCase()}</option>`;
                items.forEach(item => {
                    const opt = document.createElement("option");
                    opt.value = item._key;
                    opt.textContent = item.name || `(${label} ${item._key})`;
                    select.appendChild(opt);
                });
            });
        }

        if (saveBtn && typeof saveFunction === "function") {
            saveBtn.onclick = saveFunction;
        }
    }, 0);

    return `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}Label">Selecionar ${label}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="${id_key}_key" value="${id_key}">
                        <div class="mb-3">
                            <label for="${selectId}" class="form-label">Selecionar ${label}</label>
                            <select class="form-select" id="${selectId}">
                                <option value="">Carregando ${label}s...</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-primary" id="${saveBtnId}">Adicionar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

//Gera uma função assíncrona para salvar um item selecionado via modal em uma entidade (ex: adicionar questionário a paciente).
function saveToModalSelect(endpoint, selectInputId) {
    return async function () {
        
        const selected = document.getElementById(selectInputId)?.value;

        if (!selected) {
            alert("Selecione um item.");
            return;
        }

        try {
            await fetchData(`/${endpoint}`, "POST", {
                questionario_key: selected
            });

            alert("Adicionado com sucesso!");

            const modalId = "modal" + endpoint.charAt(0).toUpperCase() + endpoint.slice(1);
            const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
            if (modal) modal.hide();

            location.reload();
        } catch (err) {
            console.error(err);
            alert("Erro ao adicionar.");
        }
    }
}

const fetchData = async (route, method = "PUT", data = {}) => {

    const url = `${server}${route}`;

    let config = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    if (method === "GET") {
        delete config.body;
    }
    const response = await fetch(url, config);
    
    const resp = await response.json();

    return resp;
};

const saveForm = async (backRoute,frontRoute) => {

    let data = await copy();

    await save(backRoute,data);

    window.open(frontRoute,"_self");

}
const copy = async () => {

    function transformJSON(inputJSON) {
        const transformedJSON = {};

        for (const [key, value] of Object.entries(inputJSON)) {
            const parts = key.split('.'); // Split the key by '.' to get the attribute path

            let currentObject = transformedJSON; // Reference to the current object in the transformation

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (!currentObject[part]) {
                    currentObject[part] = {}; // Create nested object if it doesn't exist
                }
                currentObject = currentObject[part]; // Move to the next nested object
            }

            const lastPart = parts[parts.length - 1];
            currentObject[lastPart] = value; // Set the final attribute value
        }

        return transformedJSON;
    }

    let elements = document.getElementsByClassName("aof-input");

    let data = {}

    for (let i = 0; i < elements.length; i++) {

        let element = elements[i];
        data[element.id] = element.value;
    }

    elements = document.getElementsByClassName("aof-input-aggregate");

    for (let i = 0; i < elements.length; i++) {

        let element = elements[i];

        if (element.checked) {
            if (data[element.name] == undefined) {
                data[element.name] = []
            }
            data[element.name].push(element.value)
        }
    }

    data = transformJSON(data)

    return data;
}

const save = async (route, data) => {
    console.log("save");

    let method = "PUT";
    if (!data._key || data._key == "") {
        delete data._key
        method = "POST";
    }
    const resp = await fetchData(route, method, data);

    return resp;
}

const disabledInput = () => {

    let elements = document.getElementsByClassName("aof-input");

    for (let i = 0; i < elements.length; i++) {

        elements[i].disabled = true;
    }

    elements = document.getElementsByClassName("aof-input-aggregate");

    for (let i = 0; i < elements.length; i++) {

        elements[i].disabled = true;
    }

}