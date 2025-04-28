const fs = require("fs");
const path = require("path");

class DataControl {
    constructor() { }
    

    // MÉTODO FIND QUE CRIEI
    async find(_class, query) {
        const data = await this.getListDoc(_class);
        
        return data.filter(doc => {
            // 1. Verifica condições OR (Person_key ou Person:_key)
            const orConditions = query.$or || [];
            const hasOrConditions = orConditions.length > 0;
            
            let orPass = !hasOrConditions; // Se não houver OR, passa direto
            
            if (hasOrConditions) {
                orPass = orConditions.some(cond => {
                    const [key, value] = Object.entries(cond)[0];
                    return doc[key] == value;
                });
            }
    
            // 2. Verifica outras condições (status, etc)
            const otherConditions = Object.entries(query)
                .filter(([key]) => key !== '$or')
                .every(([key, value]) => doc[key] == value);
    
            // Documento deve passar em AMBAS as verificações
            return orPass && otherConditions;
        });
    }
    
    

    async save(_class, doc) {
        console.log("save");

        const classPath = path.join(__dirname, `${_class}.json`);
        const headerPath = path.join(__dirname, `${_class}_header.json`);

        let list = [];

        if (!fs.existsSync(classPath)) {
            const header = {
                counter: "1",
                _class: _class
            };

            doc._key = "1";
            list.push(doc);

            fs.writeFileSync(classPath, JSON.stringify(list));
            fs.writeFileSync(headerPath, JSON.stringify(header));

        } else {
            if (!doc._key) {
                doc = await this.createKey(_class, doc);
            }

            list = await this.loadJSON(classPath);

            const index = list.findIndex((d) => d._key == doc._key);

            if (index >= 0) {
                list[index] = doc;
            } else {
                list.push(doc);
            }

            fs.writeFileSync(classPath, JSON.stringify(list));
        }

        return doc;
    }

    async createKey(_class, doc) {
        const headerPath = path.join(__dirname, `${_class}_header.json`);
        const header = await this.loadJSON(headerPath);

        doc._key = (Number(header.counter) + 1).toString();
        header.counter = doc._key;

        fs.writeFileSync(headerPath, JSON.stringify(header));
        return doc;
    }

    async loadJSON(filePath) {
        const file = fs.readFileSync(filePath);
        return JSON.parse(file);
    }

    async getListDoc(_class) {
        const filePath = path.join(__dirname, `${_class}.json`);
        return await this.loadJSON(filePath);
    }

    async getDocByKey(_class, _key, level = 0) {
        const list = await this.getListDoc(_class);
        const doc = list.find((d) => d._key == _key);

        if (level > 0 && doc) {
            for (let att in doc) {
                if (att.indexOf(":") > 0) {
                    const ref_att = att.split(":");
                    const ref_doc = await this.getDocByKey(ref_att[0], doc[att]);
                    doc[att] = ref_doc;
                }
            }
        }

        return doc;
    }

    async reset(listClass = []) {
        for (let i = 0; i < listClass.length; i++) {
            const _class = listClass[i];

            const classPath = path.join(__dirname, `${_class}.json`);
            const headerPath = path.join(__dirname, `${_class}_header.json`);

            fs.writeFileSync(classPath, JSON.stringify([]));
            fs.writeFileSync(headerPath, JSON.stringify({ counter: "0", _class: _class }));
        }
    }


    sortList(list, field, order = 'asc') {
        return list.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
    
            if (field === "_key") {
                valA = Number(valA);
                valB = Number(valB);
            }
    
            if (typeof valA === "string" && typeof valB === "string") {
                return order === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }
    
            return order === "asc"
                ? (valA > valB ? 1 : valA < valB ? -1 : 0)
                : (valA < valB ? 1 : valA > valB ? -1 : 0);
        });
    }
    
    
}

module.exports = DataControl;
