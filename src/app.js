const express = require('express');
const bodyParser = require('body-parser');
const conexao = require('./config');

const app = express();


// ------- CONEXAO BANCO ---------
conexao.authenticate().then(() => {
    console.log("Banco Conectado")
}).catch((erroMsg) => {
    console.log(erroMsg)
})

;
// ------ MODELS ------
const Pix = require('../src/models/pix');
const Usuario = require('../src/models/usuario');
const Banco = require('../src/models/banco');


Promise.all([Usuario.sync({ force: true }), Banco.sync({ force: true })])
  .then(() => {
    console.log('Tabelas "usuario" e "banco" criadas com sucesso!');
    // Sincronizando a tabela Pix depois
    return Pix.sync({ force: true });
  })
  .then(() => {
    console.log('Tabela "pix" criada com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao criar as tabelas:', err);
  });
module.exports = app;
