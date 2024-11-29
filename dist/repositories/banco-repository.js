var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
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
    module2.exports = conexao;
  }
});

// src/models/banco.js
var require_banco = __commonJS({
  "src/models/banco.js"(exports2, module2) {
    var conexao = require_database();
    var { DataTypes, Model } = require("sequelize");
    var Banco2 = class extends Model {
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
    module2.exports = Banco2;
  }
});

// src/repositories/banco-repository.js
var Banco = require_banco();
var BancoRepository = class {
  //Listar bancos
  static get = async () => {
    const res = await Banco.findAll();
    if (!res) {
      return { message: "Bancos n\xE3o encontrados", status: 404 };
    }
    return { data: res, status: 200 };
  };
  // Cadastrar banco
  static post = async (body) => {
    console.log(body.id_banco);
    console.log(body.code);
    console.log(body.ispb);
    console.log(body.name);
    console.log(body.id);
    console.log(body);
    console.log(body);
    const res = await Banco.create(body);
    return { data: res, status: 201 };
  };
  // Atualizar banco pelo ID
  static put = async (id, body) => {
    const res = await Banco.findByPk(id).then((bancoEncontrado) => {
      if (!bancoEncontrado || bancoEncontrado === null) {
        return console.log("Banco n\xE3o encontrado");
      }
      return bancoEncontrado.update(body);
    });
    return res;
  };
  // Deletar banco pelo ID
  static delete = async (id) => {
    const res = await Banco.findByPk(id).then((BancoEncontrado) => {
      if (!BancoEncontrado || BancoEncontrado === null) {
        console.log("Banco n\xE3o encontrado");
      }
      return BancoEncontrado.destroy({
        where: {
          id
        }
      });
    });
    return res;
  };
  // Buscar banco pelo ID
  static getById = async (id) => {
    const res = await Banco.findByPk(id);
    return res;
  };
  static findOneByName = async (name) => {
    const res = await Banco.findOne(name);
    return res;
  };
};
module.exports = BancoRepository;
