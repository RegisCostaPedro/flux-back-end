const express = require('express');
const bodyParser = require('body-parser');
const conexao = require('./config');

const app = express();


// ------- CONEXAO BANCO ---------
conexao.authenticate().then(() =>{
    console.log("Banco Conectado")
}).catch((erroMsg) =>{
    console.log(erroMsg)
})

// ------ MODELS ------
const Usuario = require('../src/models/usuario');


module.exports = app;
