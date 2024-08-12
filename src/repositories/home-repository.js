const { Sequelize, QueryTypes, where } = require('sequelize');
const Transacao = require("../models/transacao");
const Banco = require('../models/banco');

class HomeRepository {

    static get = async (id_user) => {
        const query = await Banco.sequelize
            .query(`
                SELECT 
                usuario.nome,
                conta.id_conta,
                transacao.valor,
                transacao.tipo_operacao,
                transacao.descricao,
                banco.nome_banco
            FROM
                transacao
                    JOIN
                banco ON banco.id_banco = transacao.banco_id
                    JOIN
                conta ON conta.id_conta = transacao.conta_id
                    JOIN
                usuario ON usuario.id_usuario = transacao.usuario_id
            WHERE
                usuario.id_usuario  = :id_user;   
    `, {
                replacements: { id_user: id_user },
                type: QueryTypes.SELECT
            });

          
        return { status: 200, data: query };
    }


}



module.exports = HomeRepository;