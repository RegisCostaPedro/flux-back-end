const conexao = require('../config/database');
const { Sequelize, DataTypes, Model } = require('sequelize');

const ContaBancos = require('./conta-bancos');

class Transacao extends Model {
  static init(sequelize) {
    return super.init({
      id_transacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      contaBancos_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "conta_bancos",
          key: 'id_contaBancos',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      data_transacao: {
        type: DataTypes.DATE,
        allowNull: false
      },
      valor: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false,
        defaultValue: 0.00,

      },

      tipo_operacao: {
        type: DataTypes.ENUM('deposito', 'retirada', 'transferencia'),
        allowNull: false
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false
      },


    }, {
      sequelize,
      modelName: 'Transacao',
      tableName: 'transacao'
    });
  }
}

Transacao.init(conexao)

module.exports = Transacao;
