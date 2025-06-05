// routes/questionnaire.js
const router = require("express").Router();
const { aql } = require("arangojs");
const ObjectControl = require("../model/ObjectControl");
const oc = new ObjectControl();


function gerarPageFromQuestionario(questionario, questionDocs) {
  if (
    !questionario ||
    !questionario._key ||
    !Array.isArray(questionDocs)
  ) {
    throw new Error("Formato inválido para gerar Page do questionário.");
  }

  //Frame de INTRODUCTION (type: OPTION) – aparece antes de qualquer pergunta
  const introFrame = {
    text: `Bem-vindo! Este é o questionário "${questionario.name}".\n\n${questionario.description || ""}`,
    id: "/start",
    type: "OPTION",
    list: [
      {
        id: "1",
        text: "Sim.\n",
        onSelect: {
          jump:
            questionDocs.length > 0
              ? `option:/q-${questionDocs[0]._key}`
              : "info:/exit"
        }
      },
      {
        id: "2",
        text: "Não.\n",
        onSelect: {
          jump: "info:/exit"
        }
      }
    ]
  };

  //Para cada pergunta (qDoc), criamos um frame tipo OPTION
  const questionFrames = questionDocs.map((qDoc, idx) => {
    const frameId = `/q-${qDoc._key}`;
    const isLast = idx === questionDocs.length - 1;

    return {
      id: frameId,
      text: `${qDoc.question}\n`,
      type: "OPTION",
      list: [
        {
          id: "1",
          text: `${qDoc.alternative1}\n`,
          onSelect: {
            jump: isLast
              ? "info:/exit"                                
              : `option:/q-${questionDocs[idx + 1]._key}`   
          }
        },
        {
          id: "2",
          text: `${qDoc.alternative2}\n`,
          onSelect: {
            jump: isLast
              ? "info:/exit"
              : `option:/q-${questionDocs[idx + 1]._key}`
          }
        },
        {
          id: "3",
          text: `${qDoc.alternative3}\n`,
          onSelect: {
            jump: isLast
              ? "info:/exit"
              : `option:/q-${questionDocs[idx + 1]._key}`
          }
        },
        {
          id: "4",
          text: `${qDoc.alternative4}\n`,
          onSelect: {
            jump: isLast
              ? "info:/exit"
              : `option:/q-${questionDocs[idx + 1]._key}`
          }
        }
      ]
    };
  });

  //Frame final de “exit” (type: INFO)
  const exitFrame = {
    id: "/exit",
    type: "INFO",
    text: "Questionário finalizado. Obrigado por participar!",
    exit: true
  };

  //Montagem final do Page
  return {
    id: questionario._key,
    _key: questionario._key,
    intro: {
      type: "INTRO",
      text: introFrame.text,
      jump: "option:/start"
    },
    // Colocamos o INTRO FRAME e todos os FRAMES DE PERGUNTA em `options`
    options: [introFrame, ...questionFrames],
    forms: [],           
    info: [exitFrame]    
  };
}


// === Rota para gerar o Page completo de um questionário
router.get("/questionnaire-page/:_key", async (req, res) => {
  try {
    const questionarioKey = req.params._key;

    // 1) Busca o documento cru de Questionário
    const questionarioDoc = await oc.getDocByKey("Questionnaire", questionarioKey);
    if (!questionarioDoc) {
      return res.status(404).json({ error: "Questionário não encontrado." });
    }

    // 2) Busca todas as perguntas ligadas a este questionário via AQL
    const cursor = await oc.dc.db.query(aql`
      FOR q IN Question
        FILTER q["Questionario:_key"] == ${questionarioKey}
        RETURN q
    `);
    const questionDocs = await cursor.all();

    // 3) Gera o JSON de Page completo, colocando perguntas em `options`
    const page = gerarPageFromQuestionario(questionarioDoc, questionDocs);

    // 4) Retorna o Page completo
    return res.json(page);

  } catch (error) {
    console.error("Erro em GET /questionnaire-page/:_key:", error);
    return res.status(500).json({ error: error.message });
  }
});

// === Rota de ping (sem alterações)
router.get("/ping", (req, res) => {
  res.send({
    status: "ok",
    application: "MedBase Statistics",
    timestamp: new Date().toISOString(),
    message: "Comunicação com a aplicação MedBase Statistics confirmada."
  });
});

module.exports = router;
