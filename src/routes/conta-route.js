const express = require('express');
const router = express.Router();
const controller = require('../controllers/conta-bancaria-controller');
const authService = require('../services/auth-service');

router.post('/criar-conta-bancaria',controller.criarContaBancaria);
router.get('/listar-contas',controller.listarContasBancarias);
router.put('/atualizar-conta/:id',controller.atualizarContaBancaria);
router.delete('/deletar-conta/:id',controller.deletarContaBancaria);
// router.get('/bucar-conta/:id',controller.buscarContasBancariasPorId);


module.exports = router;