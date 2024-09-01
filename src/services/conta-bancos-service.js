const ContaBancaria = require('../models/conta-bancaria');
const Transacao = require('../models/transacao');
const Usuario = require('../models/usuario');
const contaBancariaRepository = require('../repositories/conta-bancaria-repository');
const contaBancosrepository = require('../repositories/conta-bancos-repository');
const pixRepository = require('../repositories/pix-repository');
const sequelize = require('../config/database');
const { ContaBancos } = require('../models');
const { where } = require('sequelize');
const contaBancariaService = require('../services/conta-bancaria-service');
const { verify } = require('jsonwebtoken');
const ContaBancosRepository = require('../repositories/conta-bancos-repository');

class ContaBancosService {

    static realizarTransferencia = async (
        conta_flux_id,
        conta_bancaria_origem_id,
        valor_transferencia,
        fkUsuarioId,
        descricao_transacao,
        id_conta_bancaria_destino
    ) => {
        try {
            const t = await sequelize.transaction();

            const usuario = await Usuario.findByPk(fkUsuarioId);
            if (!usuario) {
                await t.rollback();
                return { message: `Você ainda não possui uma conta bancária para realizar a transferência`, status: 404 };
            }

            const contaBancaria = await ContaBancosService.buscarContaBancaria(conta_bancaria_origem_id, fkUsuarioId);

            if (!contaBancaria || !contaBancaria.data) {
                await t.rollback();
                return { message: contaBancaria.message, status: contaBancaria.status };
            }

            if (!id_conta_bancaria_destino) {

                const saldoContaAtualizado = await contaBancariaService.atualizarSaldo(
                    conta_bancaria_origem_id,
                    valor_transferencia,
                    fkUsuarioId, descricao_transacao,
                    conta_bancaria_origem_id,
                    conta_flux_id);

                if (!saldoContaAtualizado) {
                    await t.rollback();
                    return { message: saldoContaAtualizado.message, status: saldoContaAtualizado.status };
                }

                const novoSaldo = saldoContaAtualizado.data.saldo;
                const contaAtualizada = await contaBancariaRepository.put(conta_bancaria_origem_id, novoSaldo, fkUsuarioId);
                await t.commit();
                return { data: contaAtualizada.data, status: saldoContaAtualizado.status };


            } else {

                const contaDestino = await ContaBancosService.buscarContaBancaria(id_conta_bancaria_destino, fkUsuarioId);

                if (!contaDestino) {
                    await t.rollback();
                    return { message: 'Conta de destino não encontrada', status: 404 };
                }


                const saldoAtual = parseFloat(contaBancaria.data.saldo);
                const novoSaldoOrigem = saldoAtual - parseFloat(valor_transferencia);
                const saldoDestino = parseFloat(contaDestino.data.saldo);
                const novoSaldoDestino = saldoDestino + parseFloat(valor_transferencia);

                

                await ContaBancosService.verificarSaldoSuficiente(conta_bancaria_origem_id, fkUsuarioId, saldoAtual);
               
                await Promise.all([ 
                    contaBancariaRepository.put(conta_bancaria_origem_id, novoSaldoOrigem, fkUsuarioId),
                    contaBancariaRepository.put(id_conta_bancaria_destino, novoSaldoDestino, contaDestino.data.usuario_id)
                ]);
                
                await ContaBancosService.registrarTransacao({
                    conta_id: conta_bancaria_origem_id,
                    valor: -valor_transferencia,
                    data_transacao: new Date(),
                    tipo_operacao: 'transferência',
                    descricao: descricao_transacao,
                    usuario_id: fkUsuarioId,
                    contaBancos_id: conta_flux_id,
                    conta_bancos_destino_id: id_conta_bancaria_destino
                }, { transaction: t });



                await ContaBancosService.registrarTransacao({
                    conta_id: id_conta_bancaria_destino,
                    valor: valor_transferencia,
                    data_transacao: new Date(),
                    tipo_operacao: 'depósito',
                    descricao: descricao_transacao,
                    usuario_id: contaDestino.usuario_id,
                    contaBancos_id: conta_flux_id,
                    conta_bancos_destino_id: id_conta_bancaria_destino
                }, { transaction: t })

                const contaBancariaUpdate = await contaBancariaRepository.findOne({ contaBancaria_id: conta_bancaria_origem_id, usuario_id: fkUsuarioId });
                
                await t.commit();
                return { data: contaBancariaUpdate.data, status: 201, message: "Transferência realizada com sucesso" };
            }

        } catch (error) {

            return {
                message: "Falha na requisição: " + error.message,
                status: 500
            };
        }
    }


    static async buscarContaBancaria(contaBancaria_id, usuario_id) {

        const conta = await contaBancariaRepository.findOne({ contaBancaria_id, usuario_id });
        if (!conta) {
            return { message: 'Conta não encontrada', status: 404 };
        }
        return { data: conta.data, status: conta.status };
    }

    static async verificarSaldoSuficiente(contaBancaria_id, usuario_id, valor) {


        const conta_id = contaBancaria_id;

        const conta = await ContaBancosRepository.findOne({ conta_id, usuario_id });


        if (!conta || conta.data.saldo < valor) {
            throw new Error('Saldo insuficiente');
        }

        return { data: conta.data, status: conta.status };
    }

    static async atualizarSaldoConta(idConta, novoSaldo) {
        await contaBancariaRepository.update({ saldo: novoSaldo }, { where: { id: idConta } });
    }
    static async registrarTransacao(dadosTransacao) {
        const res = await Transacao.create(dadosTransacao);

        return { data: res }
    }


}

module.exports = ContaBancosService;