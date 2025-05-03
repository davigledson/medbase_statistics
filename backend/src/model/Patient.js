class Patient {
    constructor(doc) {
        this.doc = doc;
        this.name = doc.name
        this.description = doc.description
        this.questionnaires = doc.questionnaires
        this.statusQuestinarios = doc.statusQuestinarios //aqui salva os status das reposta dos questionarios
        
        

    }
    json() {
        return this.doc;
    }
}


module.exports = Patient;