var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    var { Sequelize } = require("sequelize");
    var conexao2 = new Sequelize("flux_db", "root", "", {
      host: "localhost",
      dialect: "mysql",
      define: {
        timestamps: false,
        freezeTableName: true
      }
    });
    module2.exports = conexao2;
  }
});

// src/models/banco.js
var conexao = require_database();
var { DataTypes, Model } = require("sequelize");
var Banco = class extends Model {
  static init(sequelize) {
    return super.init({
      id_banco: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      id: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      code: {
        type: DataTypes.STRING
      },
      ispb: {
        type: DataTypes.STRING
      },
      image: {
        type: DataTypes.STRING
      },
      spi_participant_type: {
        type: DataTypes.ENUM("DIRETO", "INDIRETO")
      }
    }, {
      sequelize,
      modelName: "Banco",
      tableName: "banco"
    });
  }
};
module.exports = Banco;
