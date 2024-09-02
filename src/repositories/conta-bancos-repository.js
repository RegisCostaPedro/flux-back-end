const { where } = require('sequelize');
const Conta = require('../models/conta-bancaria');
const Usuario = require('../models/usuario');
const Banco = require('../models/banco');
const { ContaBancos, ContaBancaria } = require('../models');

class ContaBancosRepository {

    // listar contas bancarias  do usuario
    static get = async (usuario_id_TOKEN) => {

        // Lista todas as contas pertencente ao usário
        const contaEncontrada = await ContaBancos.findAll({
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

    static findOne = async (body) => {



        const contaEncontrada = await ContaBancos.findOne({
            where: {usuario_id: body.usuario_id },
            include: {
                model: ContaBancaria,
                as: "Contum",
                attributes: ['saldo'] 
              }

        });
   
        if (!contaEncontrada) {
            return {
                message: 'Conta não encontrada ou inexistente',
                status: 404
            };
        }

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


        const res = await ContaBancos.create({
            pix_id: body.id_pix,
            usuario_id: body.usuario_id,
            contaBancaria_id: body.contaBancaria_id,
            banco_id: body.banco_id,

        });
        if (!res) {
            return {
                message: 'Erro ao vincular chave pix e conta bancaria',
                status: 400
            };

        }
        return { data: `Chave vinculada com sucesso! \n ${res}`, status: 201 };
    }

    // atualizar conta bancaria do usuário
    static put = async (id, novoSaldo) => {


        return await ContaBancos.update({ saldo: novoSaldo }, { where: { contaBancaria_id: id } });
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

            if (!res) {
                return {
                    message: 'Erro deletar conta bancaria',
                    status: 400
                };
            }

            return { data: 'Conta bancaria deletada com sucesso!', status: 200 };
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
        const res = await ContaBancos.findByPk(id);
        return res;
    };
}
module.exports = ContaBancosRepository;