
const ValidationContract = require('../validators/fluent-validator');

const repository = require('../repositories/conta-bancaria-repository');
const authService = require('../services/auth-service');
const service = require('../services/Conta-bancaria-service.js');
const jwt = require('jsonwebtoken');
class ContaController {

    static listarContasBancarias = async (req, res) => {

        try {
            //Recupera o token
            const token = req.body.token || req.query.token || req.headers['x-access-token'];

            // Decodifica o token
            const dadosUsuario = await authService.decodeToken(token);

            const contas = await repository.get(dadosUsuario.id);

            if (contas.status === 200) {
                return res.status(contas.status).send(contas.data);
            } else {
                return res.status(contas.status).send({ message: contas.message });
            }
        } catch (error) {
            res.status(500).send({
                message: "Falha ao processar requisição " + error
            })
        }
    }

    static criarContaBancaria = async (req, res) => {

        try {
            //Recupera o token
            const token = req.body.token || req.query.token || req.headers['x-access-token'];

            // Decodifica o token
            const dadosUsuario = await authService.decodeToken(token);

            const conta = await repository.post({
                usuario_id: dadosUsuario.id,
                banco_id: req.body.banco_id,
                saldo: req.body.saldo,
                tipo_conta: req.body.tipo_conta,
            });

            if (conta.status === 201) {
                return res.status(201).send(conta.data);
            } else {
                return res.status(conta.status).send({ message: conta.message });
            }

        } catch (error) {
            res.status(500).send({
                message: "Falha ao processar requisição" + error
            })
        }
    }

    static atualizarContaBancaria = async (req, res) => {
        try {

            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            const dadosUsuario = await authService.decodeToken(token);

            const contaID = req.params.id;
            const valor = Number(req.body.saldo);
            const fkUsuarioId = dadosUsuario.id;

                const resultado = await service.atualizarSaldo(contaID,valor,fkUsuarioId);

                if (resultado.status === 201) {
                    return res.status(201).send(resultado.data);
                } else {
                    return res.status(resultado.status).send({ message: resultado.message });
                }
        } catch (error) {
            res.status(500).send({
                message: "Falha ao processar requisição: " + error
            });
        }
    
    }

    static deletarContaBancaria = async (req, res) => {
        try {

            //Recupera o token
            const token = req.body.token || req.query.token || req.headers['x-access-token'];

            // Decodifica o token
            const dadosUsuario = await authService.decodeToken(token);


            const conta = await repository.delete(req.params.id, dadosUsuario.id);

            if (conta.status === 201) {
                return res.status(conta.status).send(conta.data);
            } else {
                return res.status(conta.status).send({ message: conta.message });
            }

        } catch (error) {
            res.status(500).send({
                message: "Falha ao processar requisição" + error
            })
        }
    }



}

module.exports = ContaController;
