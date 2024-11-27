// src/config/database.js
var { Sequelize } = require("sequelize");
var conexao = new Sequelize("flux_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    timestamps: false,
    freezeTableName: true
  }
});
module.exports = conexao;
