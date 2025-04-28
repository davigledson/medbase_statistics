const router = require('express').Router();
const ObjectControl = require('../model/ObjectControl');

const oc = new ObjectControl();
const _class = "Question";

// Salvar novo ou atualizar (CREATE ou UPDATE)
router.post("/", async (req, res) => {
    const docB = req.body;
    const doc = await oc.save(_class, docB);
    res.send(doc);
});

router.put("/", async (req, res) => {
    const docB = req.body;
    const doc = await oc.save(_class, docB);
    res.send(doc);
});

// Buscar todos (Listar tudo)
router.get("/", async (req, res) => {
    const list = await oc.find(_class, {}); // aqui antes era getListDoc
    res.send(list);
});

// Buscar documento por _key e level
router.get("/key/:_key/level/:level", async (req, res) => {
    const doc = await oc.getDocByKey(_class, req.params._key, req.params.level);
    res.send(doc);
});

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

// Buscar Questionarios associados à Question (relacionados)
router.get("/:QuestionKey/Questionario", async (req, res) => {
    const QuestionKey = req.params.QuestionKey;
    const status = req.query.status;

    const query = {
        $or: [
            { "Question_key": QuestionKey },
            { "Question:_key": QuestionKey }
        ]
    };

    if (status !== undefined) {
        query.status = status;
    }

    try {
        const docs = await oc.find("Questionario", query);
        res.send(docs);
    } catch (err) {
        console.error("Erro ao buscar questionários:", err);
        res.status(500).send({ error: "Erro ao buscar questionários" });
    }
});

module.exports = router;
