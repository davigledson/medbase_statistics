const router = require('express').Router();
const ObjectControl = require('../model/ObjectControl');

const oc = new ObjectControl();
const _class = "User";

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

router.get("/:_key",async (req,res)=>{


    const doc = await oc.getDocByKey(_class,req.params._key)
    
    res.send(doc)
})
router.get("/key/:_key/level/:level",async (req,res)=>{


    const doc = await oc.getDocByKey(_class,req.params._key,req.params.level)
    
    res.send(doc)
})

router.put("/reset",async (req,res)=>{

    await oc.reset([_class]);

})

module.exports = router