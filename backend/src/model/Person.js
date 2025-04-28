
class Person {
    constructor(doc) {
        this.doc = doc;
        this.name = doc.name
    }
    json() {
        return this.doc;
    }
}


module.exports = Person;


