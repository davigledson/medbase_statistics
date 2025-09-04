class Questionnaire {
    constructor(doc) {
        this.doc = doc;
        this.name = doc.name;
        //this.Questionario = doc.Questionario;
        this.status = doc.status //ativado , inativo, etc
        this.description = doc.description
        this.questions = doc.questions || []
        this.MessageHistory = doc.MessageHistory || []
       
        this.frequency = doc.frequency; // ex.: 'daily', 'weekly'
        this.start_time = doc.start_time; // ex.: 8h da manha, etc
       
        

    }
    json() {
        return this.doc;
    }
}


module.exports = Questionnaire;