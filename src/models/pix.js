const conexao = require('../config/database');
const { Sequelize, DataTypes, Model, DATE } = require('sequelize');
const Usuario = require('./usuario');
const Banco = require('./banco');

class Pix extends Model {
  static init(sequelize) {
    return super.init({
      id_pix: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      key_type: {
        type: Sequelize.ENUM('EMAIL', 'CNPJ', 'TELEFONE', 'CHAVE_ALEATORIA'),
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      banco_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Banco',
          key: 'id_banco'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at:{
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('VALIDANDO','PENDENTE','REGISTRADA','ERRO'),
        allowNull: false
      }
   
    }, {
      sequelize,
      modelName: 'Pix',
      tableName: 'pix'
    });
  }
}

Pix.init(conexao);

module.exports = Pix
