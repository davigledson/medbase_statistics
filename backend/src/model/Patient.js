class Patient {
    constructor(doc) {
        this.doc = doc;
        this.name = doc.name
        this.description = doc.description
        this.phone = doc.phone
        this.questionnaires = doc.questionnaires
        this.statusQuestinarios = doc.statusQuestinarios 
        
        

    }
    json() {
        return this.doc;
    }
}


module.exports = Patient;