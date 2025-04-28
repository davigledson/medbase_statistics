const router = require('express').Router();
const ObjectControl = require('../model/ObjectControl');

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
        console.error("Erro ao atualizar questionário:", error);
        res.status(500).send({ error: "Erro ao atualizar questionário" });
    }
});



router.get("/",async (req,res)=>{

    const list = await oc.getListDoc(_class)
    
    res.send(list)
})
router.get("/key/:_key/level/:level", async (req,res)=>{


    const doc = await oc.getDocByKey(_class,req.params._key,req.params.level)
    
    res.send(doc)
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
router.get("/:PatientKey/Questionario", async (req, res) => {
    const PatientKey = req.params.PatientKey;
    const status = req.query.status;
    
    // Monta a query de forma limpa
    const query = {
        $or: [
            { "Patient_key": PatientKey },
            { "Patient:_key": PatientKey }
        ]
    };

    // Adiciona status apenas se foi fornecido
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
        if (!Array.isArray(patient.questionarios)) {
            patient.questionarios = [];
        }

        // Evita duplicação
        if (!patient.questionarios.includes(questionario_key)) {
            patient.questionarios.push(questionario_key);
        }

        const updatedDoc = await oc.save(_class, patient);
        res.send({ success: true, updated: updatedDoc });
   
});


module.exports = router