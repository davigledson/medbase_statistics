class MessageHistory {
    constructor(doc) {
        this.doc = doc;
        this.QuestionnaireId = doc.QuestionnaireId
        this.PatientId = doc.PatientId; 

        this.messages = doc.messages || []
        this.score = doc.score || null;
        this.sentAt = doc.sentAt || new Date().toISOString();
        this.questionnaireState = doc.questionnaireState || null; 
    }

    json() {
        return this.doc;
    }
}

module.exports = MessageHistory;
