
const express = require('express');
const app = require('../app');
const controller = require('../controllers/banco-controller')
const router = express.Router();
const authService = require('../services/auth-service');

// apenas administradores acessar as rotas de banco tirando a listagem
router.post('/cadastro-banco',authService.authorize,controller.cadastrarBanco); //admin
router.get('/listar-bancos',authService.authorize,controller.listarBancos); //users, para ver os bancos disponiveis
router.put('/atualizar-banco/:id',authService.authorize,controller.atualizarBanco); //admin
router.delete('/excluir-banco/:id',authService.authorize,controller.deletarBanco); //admin
// router.get('/listar-bancos/:nome',authService.authorize, controller.listarBancosPorNome ); //users,
// para ver os bancos disponiveis
// router.get('/listar-bancos/:id',authService.authorize, controller.listarBancosPorId ); //admin



module.exports = router;
