
const express = require('express');
const app = require('../app');
const controller = require('../controllers/pix-controller')
const router = express.Router();
const authService = require('../services/auth-service');


router.post('/cadastrar-chave',controller.criarChave); 
router.put('/pix/key/:id/verify',controller.verificarChave); 
router.get('/pix',controller.listarChavesPix);
router.get('/pix/key/:id',controller.buscarChavePixPorID);






module.exports = router;
