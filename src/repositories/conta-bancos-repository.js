const { where } = require('sequelize');
const Conta = require('../models/conta-bancaria');
const Usuario = require('../models/usuario');
const Banco = require('../models/banco');
const { ContaBancos } = require('../models');

class ContaBancosRepository {

    // listar contas bancarias  do usuario
    static get = async (usuario_id_TOKEN) => {

        // Lista todas as contas pertencente ao usário
        const contaEncontrada = await Conta.findAll({
            where: {
                usuario_id: usuario_id_TOKEN
            }
        }
        )
        //  Verifica se a conta existe no banco
        if (!contaEncontrada) {
            return {
                message: 'Conta não encontrada ou inexistente',
                status: 404
            };
        }

        const res = contaEncontrada;
        return { data: res, status: 200 };

    }


    // relacionar o pix com a conta bancos
    static post = async (body) => {

        console.log(body.id_pix);
        console.log(body.id_pix);
        const res = await ContaBancos.create({
            pix_id: body.id_pix,
            usuario_id: body.usuario_id,
            contaBancaria_id: null,
            banco_id: null,

        });

        return { data: res, status: 201 };
    }

    // atualizar conta bancaria do usuário
    static put = async (id, novoSaldo) => {
        return await Conta.update({ saldo: novoSaldo }, { where: { id_conta: id } });
    }

    // deletar conta bancaria do usuário
    static deletePix = async (idPix, usuario_id) => {
        try {
            const res = await ContaBancos.destroy({
                where: {
                    pix_id: idPix,
                    usuario_id: usuario_id
                }
            });

            if (res === 0) {
                return {
                    message: 'Nenhuma entrada correspondente encontrada na tabela ContaBancos',
                    status: 404
                };
            }

            return { status: 204 };
        } catch (error) {
            console.error(error);
            return {
                message: 'Erro ao deletar entradas da tabela ContaBancos',
                status: 500
            };
        }
    }

    // Buscar conta pelo ID dela
    static getById = async (id) => {
        const res = await Conta.findByPk(id);
        return res;
    };
}
module.exports = ContaBancosRepository;