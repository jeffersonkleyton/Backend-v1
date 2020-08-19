const express = require('express')
const consign = require ('consign')
const app = express()
const db = require('./config/db')


app.db = db;

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validacao.js')
    .then('./api')
    .then('./config/rotas.js')
    .into(app)

app.listen(3000, () => {
    console.log('servidor funcionando')
})