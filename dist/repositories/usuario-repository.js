var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    var { Sequelize } = require("sequelize");
    var conexao = new Sequelize("flux_db", "root", "", {
      host: "localhost",
      dialect: "mysql",
      define: {
        timestamps: false,
        freezeTableName: true
      }
    });
    module2.exports = conexao;
  }
});

// src/models/usuario.js
var require_usuario = __commonJS({
  "src/models/usuario.js"(exports2, module2) {
    var conexao = require_database();
    var { DataTypes, Model } = require("sequelize");
    var Usuario2 = class extends Model {
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
    Usuario2.init(conexao);
    module2.exports = Usuario2;
  }
});

// src/repositories/usuario-repository.js
var { where } = require("sequelize");
var Usuario = require_usuario();
var bcrypt = require("bcrypt");
var UsarioRepository = class {
  //Buscar todos usuários
  static get = async () => {
    const res = await Usuario.findAll();
    return res;
  };
  // Buscar pelo id
  static getById = async (id) => {
    const res = await Usuario.findByPk(id);
    if (!res) {
      return { message: "Usu\xE1rio n\xE3o encontrado", status: 404 };
    }
    return { data: res, status: 200 };
  };
  // Buscar pela pk
  static getByPk = async (id) => {
    const res = await Usuario.findByPk(id);
    return res;
  };
  //Cadastrar usuário
  static post = async (body) => {
    const usuario = await Usuario.create(body);
    if (!usuario) {
      return { message: "Erro ao criar usu\xE1rio", status: 400 };
    }
    return { data: usuario, status: 201 };
  };
  //Atualizar usuário
  static put = async (id, body) => {
    const res = await Usuario.findByPk(id).then((usuarioEncontrado) => {
      return usuarioEncontrado.update(body);
    });
    if (!res) {
      return { message: "Erro ao atualizar usu\xE1rio", status: 400 };
    }
    return { data: res, status: 201 };
  };
  //Deletar usuário
  static delete = async (id) => {
    const res = await Usuario.findOne({ where: { id_usuario: id } });
    const usuarioEncontrado = await Usuario.findOne({ where: { id_usuario: id } });
    if (!usuarioEncontrado) {
      return { message: "Usu\xE1rio n\xE3o encontrado", status: 404 };
    }
    await usuarioEncontrado.destroy();
    return { message: "Usu\xE1rio deletado com sucesso!", status: 200 };
  };
  //Autenticar usuário (login)
  static autenticar = async (data) => {
    console.log(data.email);
    console.log(data.email);
    console.log(data.email);
    console.log(data.email);
    const usuario = await Usuario.findOne({
      where: {
        email: data.email
      }
    });
    if (!usuario) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(data.senha, usuario.senha);
    if (!isPasswordValid) {
      return null;
    }
    return usuario;
  };
  static findByVerifyCode = async (codigo) => {
    const codigoEncontrado = await Usuario.findOne(
      {
        where: {
          verifyCode: codigo
        }
      }
    );
    if (!codigoEncontrado) {
      return {
        message: "Erro ao verificar c\xF3digo",
        status: 400
      };
    }
    const res = await this.ativarConta(codigoEncontrado.verifyCode);
    if (res) {
      return { data: "Conta ativada", status: 200 };
    }
  };
  static ativarConta = async (codigo) => {
    const res = await Usuario.update({ status: 1, verifyCode: null }, { where: { verifyCode: codigo } });
    if (!res) {
      return {
        message: "Erro ao verificar c\xF3digo",
        status: 400
      };
    }
    return res;
  };
};
module.exports = UsarioRepository;
