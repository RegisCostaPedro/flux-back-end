const conexao = require('../../bin/database')
const { Sequelize, DataTypes } = require('sequelize');

const Banco = conexao.define('banco', {
  id_banco: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  nome_banco: {
    type: DataTypes.STRING(50),
    allowNull: false,

  }

});





//  Banco.sync({ force: true })
//    .then(() => console.log('Tabela "banco" criada com sucesso!'))
//    .catch(err => console.error('Erro ao criar a tabela "banco":', err));
module.exports = Banco;
