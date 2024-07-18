
const express = require('express');
const app = require('../app');
const controller = require('../controllers/usuario-controller')
const router = express.Router();
const authService = require('../services/auth-service');
router.post('/cadastro-usuario', controller.cadastrarUsuario);
router.post('/login', controller.autenticar); // autentica usuário
router.get('/listar-usuarios',authService.authorize, controller.listarUsuarios );
router.put('/atualizar-usuario/:id',authService.authorize,controller.atualizarUsuario); // só usuarios autenticados podem editar
router.delete('/excluir-usuario/:id', controller.deletarUsuario);



module.exports = router;
