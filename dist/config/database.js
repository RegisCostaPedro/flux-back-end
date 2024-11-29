// src/config/database.js
require("dotenv").config();
var { Sequelize } = require("sequelize");
var conexao = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  define: {
    timestamps: false,
    freezeTableName: true
  }
});
module.exports = conexao;
