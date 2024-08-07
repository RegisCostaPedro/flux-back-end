
const Banco = require("../models/banco");
const {Sequelize, QueryTypes} = require('sequelize');
class HomeRepository {

    static get = async (id_user) => {
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
        if(!query){
            return {status: 404, data:  query};
        }
        console.log(query);
        return {status: 200, data:  query};
    }

}



module.exports = HomeRepository;