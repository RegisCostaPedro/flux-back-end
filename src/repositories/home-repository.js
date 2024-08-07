
const Banco = require("../models/banco");
const Conta = require('../models/conta');
const {Sequelize, QueryTypes, where} = require('sequelize');

class HomeRepository {

    static get = async (id_user,usuario_nome_token) => {

      const query = await Banco.sequelize
            .query(`
        SELECT usuario.nome,conta.saldo, banco.nome_banco, banco.descricao 
        FROM conta 
        JOIN banco ON banco.id_banco = conta.banco_id 
        JOIN usuario ON usuario.id_usuario = conta.usuario_id 
        WHERE usuario.id_usuario = :id_user   
        `,{
            replacements: {id_user :id_user},
            type: QueryTypes.SELECT
        });


        // Cso o usuário não tenha nenhuma notificação, retornara apenas o nome dele
        if(!query || query.length === 0){
            return {status: 200 , data:  {
                nome: usuario_nome_token ,
                saldo: parseFloat(0.00),
                nome_banco: null,
                descricao: null,
            }
        };
        }
      
        return {status: 200, data:  query};
    }


}



module.exports = HomeRepository;