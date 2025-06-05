const router = require('express').Router();

const { aql } = require('arangojs');
const ObjectControl = require('../model/ObjectControl');
const oc = new ObjectControl();
const _class = "Questionnaire";

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
        const list = await oc.find(_class, {}); 

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



// Rota para buscar as perguntas de um questionário
router.get('/:questionarioKey/questions', async (req, res) => {
    const questionarioKey = req.params.questionarioKey;
  
    try {
      // monta e executa a query AQL usando o tagged-template 'aql'
      const cursor = await oc.dc.db.query(aql`
        LET qdoc = DOCUMENT(Questionnaire, ${questionarioKey})
        FOR q IN Question
          FILTER q._key IN qdoc.questions
        RETURN q
      `);
      const questions = await cursor.all();
      res.send(questions);
    } catch (err) {
      console.error('Erro ao buscar perguntas:', err);
      res.status(500).send({ error: 'Erro ao buscar perguntas' });
    }
  });
  
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

// Retorna todos os pacientes que estão usando o questionário
router.get('/:key/pacientes', async (req, res) => {
    const key = req.params.key;
  
    try {
      const cursor = await oc.dc.db.query(aql`
        FOR p IN Patient
          FILTER ${key} IN p.questionnaires
          RETURN p
      `);
      const pacientes = await cursor.all();
      res.send(pacientes);
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
      res.status(500).send({ error: "Erro interno" });
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