const router = require('express').Router();

const { aql } = require('arangojs');
const ObjectControl = require('../model/ObjectControl');
const oc = new ObjectControl();
const _class = "MessageHistory";

/**
 *
 * body: { QuestionnaireId, PatientId, message, whatsappMessageId, status, channel, score, questionnaireState, mediaUrl, ... }
 */
router.post("/", async (req, res) => {
    try {
        const docB = req.body;
        const doc = await oc.save(_class, docB);
        res.send(doc);
    } catch (err) {
        console.error("Erro ao criar MessageHistory:", err);
        res.status(500).send({ error: "Erro ao criar MessageHistory" });
    }
});

 //Salvar (criar/atualizar) um MessageHistory (mesma semântica do  PUT "/" para Questionnaire)

router.put("/", async (req, res) => {
    try {
        const docB = req.body;
        const doc = await oc.save(_class, docB);
        res.send(doc);
    } catch (err) {
        console.error("Erro ao salvar MessageHistory:", err);
        res.status(500).send({ error: "Erro ao salvar MessageHistory" });
    }
});


 //Atualizar um registro específico pelo _key
 
router.put("/:_key", async (req, res) => {
    const _key = req.params._key;
    const data = req.body;

    try {
        data._key = _key;
        const updatedDoc = await oc.save(_class, data);
        res.send(updatedDoc);
    } catch (error) {
        console.error("Erro ao atualizar MessageHistory:", error);
        res.status(500).send({ error: "Erro ao atualizar MessageHistory" });
    }
});



router.get("/:_key", async (req, res) => {
    try {
        const doc = await oc.getDocByKey(_class, req.params._key);
        if (!doc) return res.status(404).send({ error: "MessageHistory não encontrado" });
        res.send(doc);
    } catch (err) {
        console.error("Erro ao buscar MessageHistory:", err);
        res.status(500).send({ error: "Erro interno" });
    }
});




module.exports = router;
