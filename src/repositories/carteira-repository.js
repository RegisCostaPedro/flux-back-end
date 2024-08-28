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
    conta_bancaria.saldo AS saldo_conta_bancaria,
    transacao.data_transacao,
    (SELECT 
            SUM(c.saldo)
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldoTotalGeral
FROM
    transacao
        JOIN
    conta_bancos ON conta_bancos.id_contaBancos = transacao.contaBancos_id
        JOIN
    conta_bancaria  ON conta_bancos.contaBancaria_id = conta_bancaria.id_conta
        JOIN
    usuario ON usuario.id_usuario = conta_bancos.usuario_id
        JOIN
    banco ON banco.id_banco = conta_bancos.banco_id
WHERE
    usuario.id_usuario = :id_user
ORDER BY transacao.data_transacao DESC  
    `, {
                replacements: { id_user: id_user },
                type: QueryTypes.SELECT
            });


        return { status: 200, data: query };
    }


}



module.exports = CarteiraRepository;