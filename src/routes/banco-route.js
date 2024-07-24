
const express = require('express');
const app = require('../app');
const controller = require('../controllers/banco-controller')
const router = express.Router();
const authService = require('../services/auth-service');

// apenas administradores acessar as rotas de banco tirando a listagem
router.post('/cadastro-banco',authService.isAdmin,controller.cadastrarBanco); //admin
router.get('/listar-bancos',authService.isAdmin,controller.listarBancos); //users, para ver os bancos disponiveis
router.get('/buscar-banco/id/:id',authService.isAdmin, controller.listarBancosPorId ); //admin
router.put('/atualizar-banco/:id',authService.isAdmin,controller.atualizarBanco); //admin
router.delete('/excluir-banco/:id',authService.isAdmin,controller.deletarBanco); //admin

// router.get('/listar-bancos/:nome',authService.authorize, controller.listarBancosPorNome ); 
//users, para ver os bancos disponiveis




module.exports = router;
