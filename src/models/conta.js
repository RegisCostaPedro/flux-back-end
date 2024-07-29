const conexao = require('../config/database');
const { Sequelize, DataTypes, Model } = require('sequelize');
const Usuario = require('./usuario');
const Banco = require('./banco');

class Conta extends Model {
 
  static init(sequelize) {
    return super.init({
      id_conta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
          key: 'id_banco',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
       
      },
      tipo_conta: {
        type: DataTypes.ENUM('corrente', 'poupanca', 'salario'),
        defaultValue: "salario",
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Conta',
      tableName: 'conta'
    });
    
  }



}

Conta.init(conexao);

module.exports = Conta;
