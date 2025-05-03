class Questionnaire {
    constructor(doc) {
        this.doc = doc;
        this.name = doc.name;
        //this.Questionario = doc.Questionario;
        this.status = doc.status
        this.description = doc.description
        this.questions = doc.questions
        

    }
    json() {
        return this.doc;
    }
}


module.exports = Questionnaire;