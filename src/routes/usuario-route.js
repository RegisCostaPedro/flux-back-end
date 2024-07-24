const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario-controller');
const authService = require('../services/auth-service');

router.post('/cadastro-usuario', controller.cadastrarUsuario); // Ajustado para o método correto
router.post('/login', controller.autenticar); 
router.post('/refresh-token', authService.authorize, controller.refreshToken); 
router.get('/listar-usuarios', authService.authorize, controller.listarUsuarios);
router.get('/buscar-usuario/:id', authService.authorize, controller.buscarUsuarioPeloID);
router.put('/atualizar-usuario/:id', authService.authorize, controller.atualizarUsuario); 
router.delete('/excluir-usuario/:id', controller.deletarUsuario);

module.exports = router;
