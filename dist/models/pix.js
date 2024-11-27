var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    var { Sequelize: Sequelize2 } = require("sequelize");
    var conexao2 = new Sequelize2("flux_db", "root", "", {
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

// src/models/pix.js
var conexao = require_database();
var { Sequelize, DataTypes, Model, DATE } = require("sequelize");
var Pix = class extends Model {
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
        type: Sequelize.ENUM("EMAIL", "CNPJ", "TELEFONE", "CHAVE_ALEATORIA"),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("VALIDANDO", "PENDENTE", "REGISTRADA", "ERRO"),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: "Pix",
      tableName: "pix"
    });
  }
};
module.exports = Pix;
