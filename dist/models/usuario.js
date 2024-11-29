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

// src/models/usuario.js
var conexao = require_database();
var { DataTypes, Model } = require("sequelize");
var Usuario = class extends Model {
  static init(sequelize) {
    return super.init({
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
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
      roles: {
        type: DataTypes.ENUM("usuario", "admin"),
        allowNull: false
      },
      verifyCode: {
        type: DataTypes.INTEGER(6),
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: "Usuario",
      tableName: "usuario"
    });
  }
};
Usuario.init(conexao);
module.exports = Usuario;
