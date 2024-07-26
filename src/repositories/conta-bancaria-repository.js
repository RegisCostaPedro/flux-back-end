const { where } = require('sequelize');
const Conta = require('../models/conta');
const Usuario = require('../models/usuario');
const Banco = require('../models/banco');



class ContaRepository {

    // listar contas
    static get = async () => {
        const res = await Conta.findAll();
        return res;
    }

    // cadastrar conta bancaria
    static post = async (body) => {

        const usuario = await Usuario.findByPk(body.usuario_id);
        const banco = await Banco.findByPk(body.banco_id);

        if (!usuario) {
            return {
                message: `O usuário com o ID ${body.usuario_id} não foi encontrado`,
                status: 404
            };

        }
        if (!banco) {
            return { message: "Banco não encontrado", status: 404 };
        }

        const res = await Conta.create({
            usuario_id: body.usuario_id,
            banco_id: body.banco_id,
            saldo: body.saldo,
            tipo_conta: body.tipo_conta
        });

        return { data: res, status: 201 };
    }

    static put = async (id, body) => {

        // Verifica se existe o usuario no banco e passado pelo token 
        const usuario = await Usuario.findByPk(body.usuario_id);
        const banco = await Banco.findByPk(body.banco_id);

        if (!usuario) {
            return {
                message: `Você ainda não possui uma conta bancaria para atualiza-lá`,
                status: 404
            };

        }
        if (!banco) {
            return { message: "Banco não encontrado", status: 404 };
        }

        // Verifica se a conta existe no banco
        const contaEncontrada = await Conta.findByPk(id);
        if (!contaEncontrada) {
            return {
                message: 'Conta não encontrada ou inexistente',
                status: 404
            };
        }
        const conta = await Conta.findByPk(id).
            then(async contaEncontrada => {

                // verifica se a conta pertence a um usuario
                if (contaEncontrada.usuario_id !== body.usuario_id) {
                    return { message: 'Esta conta já pertence a um usuário', status: 403 }
                }

                if (!contaEncontrada || contaEncontrada === null) {
                    return { message: 'Conta não encontrada ou inexistente', status: 404 }
                }

                contaEncontrada.update(body);
                const res = contaEncontrada;
                return { data: res, status: 201 }
            });

        return conta;

    }

    static delete = async (id, usuario_id_TOKEN) => {
        // Verifica se existe o usuario no banco e passado pelo token 
        const usuario = await Conta.findByPk(usuario_id_TOKEN);
        const banco = await Conta.findByPk(usuario_id_TOKEN);

        if (!usuario) {
            return {
                message: `Você ainda não possui uma conta bancaria para deleta-lá`,
                status: 404
            };

        }
        if (!banco) {
            return { message: "Banco não encontrado", status: 404 };
        }

        // Verifica se a conta existe no banco
        const contaEncontrada = await Conta.findByPk(id);
        if (!contaEncontrada) {
            return {
                message: 'Conta não encontrada ou inexistente',
                status: 404
            };
        }

        const conta = await Conta.findByPk(id).
            then(async contaEncontrada => {

                // verifica se a conta pertence a um usuario
                if (contaEncontrada.usuario_id !== usuario) {
                    return { message: 'Esta conta já pertence a um usuário', status: 403 }
                }

                if (!contaEncontrada || contaEncontrada === null) {
                    return { message: 'Conta não encontrada ou inexistente', status: 404 }
                }

                contaEncontrada.destroy(id);
                const res = contaEncontrada;
                return { data: res, status: 200 }
            });

        return conta;
    }


}

module.exports = ContaRepository;