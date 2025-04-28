class Question {
    constructor(doc) {
        this.doc = doc;
        this.question = doc.question; //pergunda
        this.alternative1 = doc.alternative1;
        this.alternative2 = doc.alternative2;
        this.alternative3 = doc.alternative3;
        this.alternative4 = doc.alternative4;
        
        this.correct = doc.correct
        //this.questionario_key = doc.questionario_key
        

    }
    json() {
        return this.doc;
    }
}


module.exports = Question;