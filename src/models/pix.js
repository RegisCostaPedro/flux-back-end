const conexao = require('../config/database');
const { Sequelize, DataTypes, Model } = require('sequelize');
const Usuario = require('./usuario');
const Banco = require('./banco');

class Pix extends Model {
  static init(sequelize) {
    return super.init({
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
          key: 'id_usuario',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      banco_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Banco,
          key: 'id_banco'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
