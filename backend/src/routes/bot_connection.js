// routes/questionnaire.js
const router = require("express").Router();
const { aql } = require("arangojs");
const ObjectControl = require("../model/ObjectControl");
const oc = new ObjectControl();

function gerarPageFromPreguntas(questionDocs) {
  if (!Array.isArray(questionDocs)) {
    throw new Error("Esperava um array de perguntas.");
  }

  // --- intro frame ---
  const introFrame = {
    text: `Aqui estão todas as suas perguntas:\n`,
    id: "/start",
    type: "OPTION",
    list: questionDocs.map((qDoc, idx) => ({
      id: String(idx + 1),
      text: `${qDoc.question}\n`,
      onSelect: { jump: `option:/q-${qDoc._key}` }
    }))
  };

  const options = [introFrame];

  // --- para cada pergunta ---
  questionDocs.forEach((qDoc, idx) => {
    const key = qDoc._key;
    const qId = `/q-${key}`;
    const fbId = `/wrong-${key}`;
    const isLast = idx === questionDocs.length - 1;
    const nextId = isLast
      ? "/exit"
      : `/q-${questionDocs[idx + 1]._key}`;

    // 1) frame da pergunta
    options.push({
      id: qId,
      text:
        `${qDoc.question}\n` +
        `1) ${qDoc.alternative1}\n` +
        `2) ${qDoc.alternative2}\n` +
        `3) ${qDoc.alternative3}\n` +
        `4) ${qDoc.alternative4}\n`,
      type: "OPTION",
      list: [1,2,3,4].map((i) => ({
        id: String(i),
        text: `${qDoc["alternative" + i]}\n`,
        onSelect: {
          jump:
            String(i) === qDoc.correct
              ? `option:${nextId}`
              : `option:${fbId}`
        }
      }))
    });

    // 2) frame de feedback (retry / skip)
    options.push({
      id: fbId,
      text: `❌ Resposta errada. O que deseja?\n`,
      type: "OPTION",
      list: [
        {
          id: "1",
          text: "1) Tentar novamente esta pergunta\n",
          onSelect: { jump: `option:${qId}` }
        },
        {
          id: "2",
          text: isLast
            ? "2) Finalizar questionário\n"
            : "2) Pular para próxima pergunta\n",
          onSelect: { jump: `option:${nextId}` }
        }
      ]
    });
  });

  // --- frame final ---
  options.push({
    id: "/exit",
    text: "🎉 Você concluiu todas as perguntas!",
    type: "INFO",
    exit: true
  });

  return {
    id: "patient-questions",
    _key: "patient-questions",
    intro: {
      type: "INTRO",
      text: introFrame.text,
      jump: "option:/start"
    },
    options,
    forms: [],
    info: []
  };
}


// rota
router.get("/patient-questions-page/:patientKey", async (req, res) => {
  try {
    const patient = await oc.getDocByKey("Patient", req.params.patientKey);
    if (!patient) return res.status(404).json({ error: "Paciente não encontrado" });

    const cursor = await oc.dc.db.query(aql`
      LET pq = DOCUMENT(Patient, ${patient._key})
      FOR q IN Question
        FILTER q["Questionario:_key"] IN pq.questionnaires
        RETURN q
    `);
    const questionDocs = await cursor.all();

    const page = gerarPageFromPreguntas(questionDocs);
    return res.json(page);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});


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
