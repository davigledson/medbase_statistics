const router = require('express').Router();
const ObjectControl = require('../model/ObjectControl');
const { aql } = require('arangojs');
const oc = new ObjectControl();
const _class = "Question";

// Salvar novo ou atualizar (CREATE ou UPDATE)
router.post("/", async (req, res) => {
    const docB = req.body;
    const doc = await oc.save(_class, docB);
    res.send(doc);
});

router.put("/:_key", async (req, res) => {
     const _key = req.params._key;
    const data = req.body;

    try {
        data._key = _key;

        const updatedDoc = await oc.save(_class, data);
        res.send(updatedDoc);
    } catch (error) {
        console.error("Erro ao atualizar pergunta:", error);
        res.status(500).send({ error: "Erro ao atualizar pergunta" });
    }
});

// Buscar todos (Listar tudo)
router.get("/", async (req, res) => {
    const list = await oc.find(_class, {}); // aqui antes era getListDoc
    res.send(list);
});



// Retorna todos os questionários que usam a pergunta
router.get('/:key/questionarios', async (req, res) => {
  const key = req.params.key;
  try {
    const cursor = await oc.dc.db.query(aql`
      FOR q IN Questionnaire
        FILTER ${key} IN q.questions
        RETURN q
    `);
    const result = await cursor.all();
    res.send(result);
  } catch (err) {
    console.error("Erro ao buscar questionários que usam a pergunta:", err);
    res.status(500).send({ error: "Erro interno" });
  }
});

module.exports = router;


// Buscar documento por _key (sem level)
router.get("/:_key", async (req, res) => {
    const doc = await oc.getDocByKey(_class, req.params._key);
    res.send(doc);
});

// Resetar coleção (deletar tudo da coleção)
router.put("/reset", async (req, res) => {
    try {
        await oc.reset([_class]);
        res.send({ success: true });
    } catch (err) {
        console.error("Erro ao resetar:", err);
        res.status(500).send({ error: "Erro ao resetar coleção" });
    }
});



module.exports = router;
