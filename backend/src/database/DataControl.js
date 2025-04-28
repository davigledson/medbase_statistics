
const path = require("path");
const { Database } = require("arangojs"); // Corrigido aqui!


class DataControl {
    constructor() {
        this.db = new Database({
            url: "http://127.0.0.1:8529", // seu endpoint
        });
        this.db.useBasicAuth("root", "1234"); // usuário e senha
        this.db.useDatabase("mydb"); // usa o banco

        console.log('Conectado ao ArangoDB');
        this.db.query('FOR q IN Question RETURN q')

    }

    async find(_collectionName, query) {
        const cursor = await this.db.query(`
            FOR doc IN ${_collectionName}
                FILTER ${this.buildFilter(query)}
                RETURN doc
        `);
        return await cursor.all();
    }
     // Atualizando para usar a coleção dinâmica
     async getDocByKey(_class, key) {
        const query = `FOR q IN ${_class} FILTER q._key == @key RETURN q`;
        const cursor = await this.db.query(query, { key });
        const result = await cursor.all();
        return result[0]; // Retorna o documento correspondente à chave
    }

    async save(_collectionName, doc) {
        const collection = this.db.collection(_collectionName);

        try {
            await collection.save(doc, { overwrite: true });
            return doc;
        } catch (error) {
            console.error('Erro salvando documento:', error);
            throw error;
        }
    }

    buildFilter(query) {
        // Constrói um filtro ArangoDB AQL básico baseado no objeto query
        const filters = [];

        if (query.$or) {
            const orFilters = query.$or.map(cond => {
                const [field, value] = Object.entries(cond)[0];
                return `doc.${field} == "${value}"`;
            });
            filters.push(`(${orFilters.join(' OR ')})`);
        }

        Object.entries(query)
            .filter(([key]) => key !== '$or')
            .forEach(([key, value]) => {
                filters.push(`doc.${key} == "${value}"`);
            });

        return filters.length ? filters.join(' AND ') : '1 == 1'; // nenhum filtro = retorna tudo
    }
}

module.exports = DataControl;
