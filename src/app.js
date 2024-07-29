const express = require('express');
const bodyParser = require('body-parser');
const conexao = require('./config/database');
const config = require('./config/config');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ------- CONEXAO BANCO ---------
conexao.authenticate().then(() => {
    console.log("Banco Conectado")
}).catch((erroMsg) => {
    console.log(erroMsg)
})

/* ------ MODELS ------------------------------  
Caso as tebelas não estajam criadas descomente as linhas abaixo (linha 19-32)
   e elas serão criadas automaticamente  
   Você pode dar CTRL + D e repetir o mesmo atalho para selecionar todas as '//'  */

//  const Usuario = require('./models/usuario');
//  const Pix = require('./models/pix');
//  const Banco = require('./models/banco');
//  const Conta = require('./models/conta');
//  const Transacao = require('./models/transacao');

// Função imediata
// (async () => {
//     try {
//       await conexao.sync({ force: true });
//       console.log('Todas as tabelas foram recriadas com sucesso!');
//     } catch (err) {
//       console.error('Erro ao recriar as tabelas:', err);
//     }
// })();

// ------ Carrega Rotas ------
const indexRoute = require('./routes/index-route');
const usuarioRoute = require('./routes/usuario-route');
const bancoRoute = require('./routes/banco-route');
const contaRoute = require('./routes/conta-route');

// rotas de acesso 
app.use('/', indexRoute);
app.use('/flux', usuarioRoute);
app.use('/banco', bancoRoute);
app.use('/conta',contaRoute);


// ------ Habilita o CORS ------
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
module.exports = app;
