const conexao = require('../config/database');
const Usuario = require('./usuario');
const Banco = require('./banco');
const { Sequelize, DataTypes } = require('sequelize');

const Pix = conexao.define('pix', {
    id_pix: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    chave_pix: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
        }
    },
    banco_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Banco,
            key: 'id_banco'
        }
    }

});



//   Pix.sync({ force: true })
//     .then(() => console.log('Tabela "pix" criada com sucesso!'))
//     .catch(err => console.error('Erro ao criar a tabela "pix":', err));
  
module.exports = Pix;


