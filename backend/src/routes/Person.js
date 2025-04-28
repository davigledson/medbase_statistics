const router = require('express').Router();
const ObjectControl = require('../model/ObjectControl');

const oc = new ObjectControl();
const _class = "Person";

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
//     const personKey = req.params._key;

//     const Questionario = await oc.find("Questionario", { "Person:_key": personKey });

//     res.send(Questionario);
// });
router.get("/:personKey/Questionario", async (req, res) => {
    const personKey = req.params.personKey;
    const status = req.query.status;
    
    // Monta a query de forma limpa
    const query = {
        $or: [
            { "Person_key": personKey },
            { "Person:_key": personKey }
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



module.exports = router