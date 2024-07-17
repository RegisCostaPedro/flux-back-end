const express = require('express');
const bodyParser = require('body-parser');
const conexao = require('../bin/database');
const config = require('./config');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ------- CONEXAO BANCO ---------
conexao.authenticate().then(() => {
    console.log("Banco Conectado")
}).catch((erroMsg) => {
    console.log(erroMsg)
})


// ------ MODELS ------
const Pix = require('../src/models/pix');
const Usuario = require('../src/models/usuario');
const Banco = require('../src/models/banco');



// ------ Carrega Rotas ------
const router = express.Router()
const indexRoute = require('./routes/index-route');
const usuarioRoute = require('./routes/usuario-route');


app.use('/',indexRoute);
app.use('/flux',usuarioRoute)


module.exports = app;
