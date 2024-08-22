const express = require('express');
const bodyParser = require('body-parser');
const conexao = require('./config/database');
const config = require('./config/config');
const cors = require('cors');


require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

//    const Usuario = require('./models/usuario');
//    const Pix = require('./models/pix');
//    const Banco = require('./models/banco');
//    const Conta = require('./models/conta-bancaria');
//    const Transacao = require('./models/transacao');
//  const ContaBancos = require('./models/conta-bancos');

// Função imediata
//  (async () => {
//      try {
//         await conexao.sync({ force: true });
//        console.log('Todas as tabelas foram recriadas com sucesso!');
//      } catch (err) {
//        console.error('Erro ao recriar as tabelas:', err);
//      }
//  })();

// AVISO ! APOS A COMPILAÇÃO COMENTE ESSAS LINHAS NOVAMENTE, SENÃO VOCÊ PODE PERDER TODO O CONTEUDO

// ------ Carrega Rotas ------
const indexRoute = require('./routes/index-route');
const usuarioRoute = require('./routes/usuario-route');
const bancoRoute = require('./routes/banco-route');
const contaRoute = require('./routes/conta-route');
const pixRoute = require('./routes/pix-route');
const homeRoute = require('./routes/home-route');
const carteiraRoute = require('./routes/carteira-route')

// rotas de acesso 
app.use('/', indexRoute);
app.use(homeRoute);
app.use(carteiraRoute);
app.use('/login',usuarioRoute);
app.use('/flux', usuarioRoute);
app.use('/banco', bancoRoute);
app.use('/conta',contaRoute);
app.use(pixRoute)


// ------ Habilita o CORS ------
app.use(cors({
    origin: '*', // Permite todas as origens; ajuste conforme necessário
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-access-token']
}));
module.exports = app;
