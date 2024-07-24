const conexao = require('../config/database');
const { Sequelize, DataTypes, Model } = require('sequelize');
const Conta = require('./conta');
const Usuario = require('./usuario');

class Transacao extends Model {
  static init(sequelize) {
    return super.init({
      id_transacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      conta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Conta,
          key: 'id_conta',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      data_transacao: {
        type: DataTypes.DATE,
        allowNull: false
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        set(valor) {
          if (valor < 0) {
            throw new Error('O valor da transação não pode ser negativo');
          }
          this.setDataValue('valor', valor);
        }
      },
      tipo_transacao: {
        type: DataTypes.ENUM('debito', 'credito', 'transferencia'),
        allowNull: false
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false
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
      }
    }, {
      sequelize,
      modelName: 'Transacao',
      tableName: 'transacao'
    });
  }
}

Transacao.init(conexao);

module.exports = Transacao;
