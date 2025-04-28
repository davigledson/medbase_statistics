const router = require('express').Router();
const ObjectControl = require('../model/ObjectControl');

const oc = new ObjectControl();
const _class = "Questionario";

router.post("/",async (req,res)=>{

    const docB = req.body

    const doc = await oc.save(_class,docB)
    
    res.send(doc)
})


router.put("/",async (req,res)=>{

    const docB = req.body

    const doc = await oc.save(_class,docB)
    
    res.send(doc)
})
//FALTAVA
// Atualizar um questionário específico pelo _key
router.put("/:_key", async (req, res) => {
    const _key = req.params._key;
    const data = req.body;

    try {
        data._key = _key;

        const updatedDoc = await oc.save(_class, data);
        res.send(updatedDoc);
    } catch (error) {
        console.error("Erro ao atualizar questionário:", error);
        res.status(500).send({ error: "Erro ao atualizar questionário" });
    }
});


// Rota com ordenação
router.get("/", async (req, res) => {
    try {
        const { sort, order = 'asc' } = req.query;
        let list = await oc.getListDoc(_class);

        // Verifica se deve ordenar
        if (sort) {
            list = oc.sortList(list, sort, order);
        }

        res.send(list);
    } catch (error) {
        console.error("Erro ao buscar questionários:", error);
        res.status(500).send({ error: "Erro ao buscar questionários" });
    }
});



router.get("/:_key",async (req,res)=>{


    const doc = await oc.getDocByKey(_class,req.params._key)
    
    res.send(doc)
})


router.put("/reset",async (req,res)=>{

    await oc.reset([_class]);

})
router.get("/key/:_key/level/:level", async (req,res)=>{


    const doc = await oc.getDocByKey(_class,req.params._key,req.params.level)
    
    res.send(doc)
})

router.put("/:_key/person/:personKey", async (req, res) => {
    const QuestionarioKey = req.params._key;
    const personKey = req.params.personKey;
    const data = req.body;

    try {
        data._key = QuestionarioKey;
        data.Person_key = personKey;

        const updatedDoc = await oc.save(_class, data);

        res.send(updatedDoc);
    } catch (error) {
        console.error("Erro ao atualizar Questionario:", error);
        res.status(500).send({ error: "Erro ao atualizar o Questionario." });
    }
});



router.get("/person/:personKey", async (req, res) => {
    const personKey = req.params.personKey;

    try {
        const allExams = await oc.getListDoc(_class);
        const filteredExams = allExams.filter(doc => {
            return doc["Person_key"] == personKey || doc["Person:_key"] == personKey;
        });

        res.send(filteredExams);
    } catch (error) {
        console.error("Erro ao buscar Questionario da pessoa:", error);
        res.status(500).send({ error: "Erro ao buscar Questionario da pessoa." });
    }
});

router.get("/:questionarioKey/person", async (req, res) => {
    const questionarioKey = req.params.questionarioKey;
    
    try {
        
        const questionario = await oc.getDocByKey(_class, questionarioKey);
        
        if (!questionario) {
            return res.status(404).send({ error: "Questionário não encontrado" });
        }

        
        const allPeople = await oc.getListDoc("Person");
        
        
        const pessoasRelacionadas = allPeople.filter(person => {
            // Verifica se a pessoa está vinculada ao questionário
            // Pode ser por Person_key ou Person:_key no questionário
            return questionario.Person_key === person._key || 
                   questionario["Person:_key"] === person._key;
        });

        res.send(pessoasRelacionadas);
    } catch (error) {
        console.error("Erro ao buscar pessoas do questionário:", error);
        res.status(500).send({ error: "Erro ao buscar pessoas relacionadas ao questionário" });
    }
});

// Adiciona uma pergunta existente a um questionário
router.post("/:questionarioKey/add-question", async (req, res) => {
    const questionarioKey = req.params.questionarioKey;
    const { question_key } = req.body;

    try {
        if (!question_key) {
            return res.status(400).send({ error: "Chave da pergunta não fornecida." });
        }

        const questionario = await oc.getDocByKey(_class, questionarioKey);

        if (!questionario) {
            return res.status(404).send({ error: "Questionário não encontrado." });
        }

        // Inicializa o array se não existir
        if (!Array.isArray(questionario.questions)) {
            questionario.questions = [];
        }

        // Evita duplicação da pergunta
        if (!questionario.questions.includes(question_key)) {
            questionario.questions.push(question_key);
        }

        const updatedDoc = await oc.save(_class, questionario);

        res.send({ success: true, updated: updatedDoc });
    } catch (error) {
        console.error("Erro ao adicionar pergunta ao questionário:", error);
        res.status(500).send({ error: "Erro ao adicionar pergunta." });
    }
});


module.exports = router