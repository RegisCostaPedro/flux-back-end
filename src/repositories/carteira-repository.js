const { Sequelize, QueryTypes, where } = require('sequelize');
const Transacao = require("../models/transacao");
const Banco = require('../models/banco');

class CarteiraRepository {

    static get = async (id_user) => {
        const query = await Banco.sequelize
            .query(`
                    SELECT 
                    usuario.id_usuario,
                    transacao.valor, 
                    transacao.tipo_operacao,
                    transacao.descricao, 
                    conta.saldo AS novo_saldo, 
                    transacao.data_transacao,
                    (SELECT SUM(c.saldo)
                    FROM conta c 
                    WHERE c.usuario_id = usuario.id_usuario) AS saldoTotalGeral
                FROM 
                    transacao
                JOIN 
                    conta ON conta.id_conta = transacao.conta_id
                JOIN  
                    usuario ON usuario.id_usuario = conta.usuario_id
                JOIN 
                    banco ON banco.id_banco = conta.banco_id
                WHERE 
                    usuario.id_usuario = :id_user
                ORDER BY 
                    transacao.data_transacao DESC;   
    `, {
                replacements: { id_user: id_user },
                type: QueryTypes.SELECT
            });


        return { status: 200, data: query };
    }


}



module.exports = CarteiraRepository;