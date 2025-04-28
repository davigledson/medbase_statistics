require('dotenv').config()
const express = require('express')
const cors = require('cors');

const person = require('./src/routes/Person')
const user = require('./src/routes/User')
const Questionario = require('./src/routes/Questionario')
const question = require('./src/routes/Question')
const patient = require('./src/routes/Patient')

const app = express()

app.use(cors({}));

app.use(express.json());

app.use('/person',person)
app.use('/user',user)
app.use('/Questionario',Questionario)
app.use('/question',question)
app.use('/patient',patient)

const port = process.env.SERVER_PORT || 3000; 

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
