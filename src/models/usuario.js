const conexao = require('../../bin/database');

const { Sequelize, DataTypes } = require('sequelize');

const Usuario = conexao.define('usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },

});





//  Usuario.sync({ force: true })
//    .then(() => console.log('Tabela "usuario" criada com sucesso!'))
//    .catch(err => console.error('Erro ao criar a tabela "usuario":', err));
module.exports = Usuario;
