const DataControl = require("./DataControl");

async function init() {
  const dc = new DataControl();

  // Lista de coleções para criar
  const collections = [
    "Patient",
    "Question",
    "Questionnaire",
    
  ];

  for (const name of collections) {
    const col = dc.db.collection(name);
    const exists = await col.exists();
    if (!exists) {
      await dc.db.createCollection(name);
      console.log(`Coleção criada: ${name}`);
    } else {
      console.log(`Coleção já existe: ${name}`);
    }
  }

  console.log("Inicialização concluída.");
  process.exit(0);
}

init().catch((err) => {
  console.error("Erro ao inicializar banco:", err);
  process.exit(1);
});
