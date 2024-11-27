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

// src/models/conta-bancaria.js
var require_conta_bancaria = __commonJS({
  "src/models/conta-bancaria.js"(exports2, module2) {
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
    module2.exports = ContaBancaria;
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

// src/repositories/conta-bancaria-repository.js
var Conta = require_conta_bancaria();
var Usuario = require_usuario();
var Banco = require_banco();
var ContaBancariaRepository = class {
  // listar contas bancarias  do usuario
  static get = async (usuario_id_TOKEN) => {
    const contaEncontrada = await Conta.findAll({
      include: [
        {
          model: Banco,
          attributes: ["id_banco", "name", "image"]
        }
      ],
      where: {
        usuario_id: usuario_id_TOKEN
      }
    });
    console.log(contaEncontrada);
    if (!contaEncontrada) {
      return {
        message: "Conta n\xE3o encontrada ou inexistente",
        status: 404
      };
    }
    const res = contaEncontrada;
    return { data: res, status: 200 };
  };
  // cadastrar conta bancaria
  static post = async (body) => {
    console.log("Request Body:", body);
    const tipo_conta = body.tipo_conta.toUpperCase();
    const usuario = await Usuario.findByPk(body.fkUsuarioId);
    const banco = await Banco.findByPk(body.fkBancoId);
    console.log("Banco ID:", body.fkBancoId);
    if (!usuario) {
      return {
        message: `O usu\xE1rio com o ID ${body.fkUsuarioId} n\xE3o foi encontrado`,
        status: 404
      };
    }
    if (!banco) {
      return { message: "Banco n\xE3o encontrado", status: 404 };
    }
    const res = await Conta.create({
      usuario_id: body.fkUsuarioId,
      banco_id: body.fkBancoId,
      saldo: body.saldo,
      tipo_conta
    });
    return { data: res, status: 201 };
  };
  // atualizar conta bancaria do usuário
  static put = async (contaBancaria_id, novoSaldo, fkUsuarioId) => {
    const contaEncontrada = await Conta.findByPk(contaBancaria_id);
    if (!contaEncontrada) {
      return { message: "Conta n\xE3o encontrada", status: 404 };
    }
    const res = await contaEncontrada.update({ saldo: novoSaldo });
    return { data: res, status: 201 };
  };
  // deletar conta bancaria do usuário
  static delete = async (id, usuario_id_TOKEN) => {
    const usuario_id = usuario_id_TOKEN;
    const usuario = await Conta.findOne({ where: { usuario_id } });
    const banco = await Conta.findOne({ where: { usuario_id } });
    if (!usuario) {
      return {
        message: `Voc\xEA ainda n\xE3o possui uma conta bancaria para deleta-l\xE1`,
        status: 404
      };
    }
    if (!banco) {
      return { message: "Banco n\xE3o encontrado", status: 404 };
    }
    const contaEncontrada = await Conta.findOne({
      where: {
        id_conta: id,
        usuario_id
      }
    });
    if (!contaEncontrada) {
      return {
        message: "Conta n\xE3o encontrada ou inexistente",
        status: 404
      };
    }
    if (contaEncontrada.usuario_id !== usuario_id) {
      return {
        message: "Esta conta n\xE3o pertence a voc\xEA",
        status: 403
      };
    }
    await contaEncontrada.destroy();
    return {
      message: "Conta deletada com sucesso.",
      status: 200
    };
  };
  // Buscar uma conta bancaira do usuário
  static findOne = async (body) => {
    const res = await Conta.findOne({
      where: {
        id_conta: body.contaBancaria_id,
        usuario_id: body.usuario_id
      }
    });
    if (!res) {
      return { message: "Voc\xEA n\xE3o possui contas bancarias registradas", status: 404 };
    }
    return { data: res, status: 200 };
  };
  // Buscar conta bancaira pelo PK dela
  static getById = async (id) => {
    const res = await Conta.findByPk(id);
    if (!res || res === null || res === void 0) {
      return { message: "Voc\xEA n\xE3o possui contas bancarias criadas", status: 404 };
    }
    return { data: res, status: 200 };
  };
};
module.exports = ContaBancariaRepository;
