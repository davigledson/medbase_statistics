require('dotenv').config()
const express = require('express')
const cors = require('cors');

const person = require('./src/routes/Person')
const user = require('./src/routes/User')
const questionnaire = require('./src/routes/Questionnaire')
const question = require('./src/routes/Question')
const patient = require('./src/routes/Patient')
const bot_connection = require('./src/routes/bot_connection')

const app = express()

app.use(cors({}));

app.use(express.json());

app.use('/person',person)
app.use('/user',user)
app.use('/questionnaire',questionnaire)
app.use('/question',question)
app.use('/patient',patient)
app.use('/bot_connection',bot_connection)

const port = process.env.SERVER_PORT || 3000; 

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
