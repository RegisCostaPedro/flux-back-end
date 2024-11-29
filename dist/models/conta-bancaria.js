var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    require("dotenv").config();
    var { Sequelize } = require("sequelize");
    var conexao2 = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      define: {
        timestamps: false,
        freezeTableName: true
      }
    });
    module2.exports = conexao2;
  }
});

// src/models/conta-bancaria.js
var conexao = require_database();
var { DataTypes, Model } = require("sequelize");
var ContaBancaria = class extends Model {
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
          model: "usuario",
          key: "id_usuario",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      },
      banco_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "banco",
          key: "id_banco",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      },
      saldo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      tipo_conta: {
        type: DataTypes.ENUM("CORRENTE", "POUPANCA", "SALARIO"),
        defaultValue: "SALARIO",
        allowNull: false
      }
    }, {
      sequelize,
      modelName: "Conta",
      tableName: "conta_bancaria"
    });
  }
};
ContaBancaria.init(conexao);
module.exports = ContaBancaria;
