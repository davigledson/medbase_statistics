const router = require('express').Router();
const ObjectControl = require('../model/ObjectControl');
const { aql } = require('arangojs');
const oc = new ObjectControl();
const _class = "Patient";

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

router.put("/:_key", async (req, res) => {
    const _key = req.params._key;
    const data = req.body;

    try {
        data._key = _key;

        const updatedDoc = await oc.save(_class, data);
        res.send(updatedDoc);
    } catch (error) {
        console.error("Erro ao atualizar paciente:", error);
        res.status(500).send({ error: "Erro ao atualizar paciente" });
    }
});



router.get("/",async (req,res)=>{

    const list = await oc.find(_class, {}); 
    
    res.send(list)
})


router.get("/:_key",async (req,res)=>{


    const doc = await oc.getDocByKey(_class,req.params._key)
    
    res.send(doc)
})

router.put("/reset",async (req,res)=>{

    await oc.reset([_class]);

})


// ROTA FALTA CONSERTAR Listar Questionario da pessoa
// Listar todos os Questionario de uma pessoa
// router.get("/:_key/Questionario", async (req, res) => {
//     const PatientKey = req.params._key;

//     const Questionario = await oc.find("Questionario", { "Patient:_key": PatientKey });

//     res.send(Questionario);
// });
// Retorna todos os questionários associados ao paciente
router.get('/:key/questionarios', async (req, res) => {
    const key = req.params.key;
    try {
      const cursor = await oc.dc.db.query(aql`
        LET pdoc = DOCUMENT(Patient, ${key})
        FOR q IN Questionnaire
          FILTER q._key IN pdoc.questionnaires
        RETURN q
      `);
      const questionnaires = await cursor.all();
      res.send(questionnaires);
    } catch (error) {
      console.error("Erro ao buscar questionários do paciente:", error);
      res.status(500).send({ error: "Erro ao buscar questionários do paciente" });
    }
  });

// Adiciona um questionário a um paciente (em formato de lista)
router.post("/:patientKey/add-questionario", async (req, res) => {
    const patientKey = req.params.patientKey;
    const { questionario_key } = req.body;

        if (!questionario_key) {
            return res.status(400).send({ error: "Chave do questionário não fornecida." });
        }

        const patient = await oc.getDocByKey(_class, patientKey);

        if (!patient) {
            return res.status(404).send({ error: "Paciente não encontrado." });
        }

        // Inicializa o array se não existir
        if (!Array.isArray(patient.questionnaires)) {
            patient.questionnaires = [];
        }

        // Evita duplicação
        if (!patient.questionnaires.includes(questionario_key)) {
            patient.questionnaires.push(questionario_key);
        }

        const updatedDoc = await oc.save(_class, patient);
        res.send({ success: true, updated: updatedDoc });
   
});


module.exports = router