const conexao = require('../config/database')
const { Sequelize, DataTypes } = require('sequelize');
const Usuario = require('./usuario');
const Banco = require('./banco');

const Conta = conexao.define('conta',{
id_conta :{
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
},
usuario_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: Usuario,
        key: 'id_usuario'
    }
},
banco_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: Banco,
        key: 'id_banco'
    }
},

saldo:{
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00

},
tipo_conta:{
    type: DataTypes.ENUM('corrente', 'poupanca', 'salario'),
    allowNull: false
}

});





//  Conta.sync({force: true}).then(()=>{
//      console.log('Tabela "conta" criada com sucesso!');
//  }).catch((err)=>{
//      console.error('Erro ao criar a tabela "conta":', err);
//  })

module.exports = Conta;