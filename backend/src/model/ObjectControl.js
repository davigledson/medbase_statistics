const DataControl = require("../database/DataControl");
const User = require("./User");
const Questionnaire = require("./Questionnaire");
const Question = require("./Question");
const MessageHistory = require('./MessageHistory')

const obj_map = {
    User,
    Questionnaire,
    Question,
    MessageHistory
};

class ObjectControl {
    constructor() {
        this.dc = new DataControl();
    }

    async find(_class, query) {
        return await this.dc.find(_class, query);
    }

    async getDocAsObj(_class, key) {
        const doc = await this.dc.getDocByKey(_class, key); 
        return new obj_map[_class](doc);
    }

    async save(_class, doc) {
        return await this.dc.save(_class, doc);
    }

    async reset(listClass) {
        await this.dc.reset(listClass); 
    }

    async getListDoc(_class) {
        return await this.dc.getListDoc(_class);
    }

    async getDocByKey(_class, key) {
        return await this.dc.getDocByKey(_class, key); 
    }


    sortList(documents, field, order = 'asc') {
        return this.dc.sortList(documents, field, order);
    }
}

module.exports = ObjectControl;
