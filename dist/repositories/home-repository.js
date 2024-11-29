var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    require("dotenv").config();
    var { Sequelize: Sequelize2 } = require("sequelize");
    var conexao = new Sequelize2(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
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

// src/models/conta-bancos.js
var require_conta_bancos = __commonJS({
  "src/models/conta-bancos.js"(exports2, module2) {
    var { DataTypes, Model, Sequelize: Sequelize2 } = require("sequelize");
    var Usuario2 = require_usuario();
    var ContaBancaria = require_conta_bancaria();
    var Banco2 = require_banco();
    var ContaBancos = class extends Model {
      static init(sequelize) {
        return super.init(
          {
            id_contaBancos: {
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            pix_id: {
              type: Sequelize2.UUID,
              allowNull: true,
              references: {
                model: "pix",
                key: "id_pix",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
              }
            },
            // usuario_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     references: {
            //         model: Usuario,
            //         key: 'id_usuario',
            //         onDelete: 'CASCADE',
            //         onUpdate: 'CASCADE'
            //     }
            // },
            contaBancaria_id: {
              type: DataTypes.INTEGER,
              allowNull: true,
              references: {
                model: ContaBancaria,
                key: "id_conta",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
              }
            },
            status: {
              type: DataTypes.ENUM("ATIVO", "INATIVO"),
              allowNull: false,
              defaultValue: "ATIVO"
            }
          },
          {
            sequelize,
            tableName: "conta_bancos",
            timestamps: true
          }
        );
      }
    };
    module2.exports = ContaBancos;
  }
});

// src/models/transacao.js
var require_transacao = __commonJS({
  "src/models/transacao.js"(exports2, module2) {
    var conexao = require_database();
    var { Sequelize: Sequelize2, DataTypes, Model } = require("sequelize");
    var ContaBancos = require_conta_bancos();
    var Transacao2 = class extends Model {
      static init(sequelize) {
        return super.init({
          id_transacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          conta_flux_origem_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: "conta_bancos",
              key: "id_contaBancos",
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
            }
          },
          data_transacao: {
            type: DataTypes.DATE,
            allowNull: false
          },
          valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
          },
          tipo_operacao: {
            type: DataTypes.ENUM("deposito", "retirada", "transferencia"),
            allowNull: false
          },
          descricao: {
            type: DataTypes.TEXT,
            allowNull: false
          },
          conta_bancos_destino_id: {
            type: DataTypes.INTEGER,
            allowNull: true
          }
        }, {
          sequelize,
          modelName: "Transacao",
          tableName: "transacao",
          timestamps: true
        });
      }
    };
    Transacao2.init(conexao);
    module2.exports = Transacao2;
  }
});

// src/repositories/usuario-repository.js
var require_usuario_repository = __commonJS({
  "src/repositories/usuario-repository.js"(exports2, module2) {
    var { where: where2 } = require("sequelize");
    var Usuario2 = require_usuario();
    var bcrypt = require("bcrypt");
    var UsarioRepository = class {
      //Buscar todos usuários
      static get = async () => {
        const res = await Usuario2.findAll();
        return res;
      };
      // Buscar pelo id
      static getById = async (id) => {
        const res = await Usuario2.findByPk(id);
        if (!res) {
          return { message: "Usu\xE1rio n\xE3o encontrado", status: 404 };
        }
        return { data: res, status: 200 };
      };
      // Buscar pela pk
      static getByPk = async (id) => {
        const res = await Usuario2.findByPk(id);
        return res;
      };
      //Cadastrar usuário
      static post = async (body) => {
        const usuario = await Usuario2.create(body);
        if (!usuario) {
          return { message: "Erro ao criar usu\xE1rio", status: 400 };
        }
        return { data: usuario, status: 201 };
      };
      //Atualizar usuário
      static put = async (id, body) => {
        const res = await Usuario2.findByPk(id).then((usuarioEncontrado) => {
          return usuarioEncontrado.update(body);
        });
        if (!res) {
          return { message: "Erro ao atualizar usu\xE1rio", status: 400 };
        }
        return { data: res, status: 201 };
      };
      //Deletar usuário
      static delete = async (id) => {
        const res = await Usuario2.findOne({ where: { id_usuario: id } });
        const usuarioEncontrado = await Usuario2.findOne({ where: { id_usuario: id } });
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
        const usuario = await Usuario2.findOne({
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
        const codigoEncontrado = await Usuario2.findOne(
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
        const res = await Usuario2.update({ status: 1, verifyCode: null }, { where: { verifyCode: codigo } });
        if (!res) {
          return {
            message: "Erro ao verificar c\xF3digo",
            status: 400
          };
        }
        return res;
      };
    };
    module2.exports = UsarioRepository;
  }
});

// src/repositories/home-repository.js
var { Sequelize, QueryTypes, where } = require("sequelize");
var Transacao = require_transacao();
var Banco = require_banco();
var usarioRepository = require_usuario_repository();
var Usuario = require_usuario();
var HomeRepository = class {
  static getHomeData = async (id_user, limit) => {
    const nome = await usarioRepository.getById(id_user);
    const query = await Banco.sequelize.query(
      `SELECT 
    usuario.nome,
    transacao.conta_flux_origem_id,
    banco_origem.image AS imagem_banco_origem,
    banco_origem.name AS nome_banco_origem,
    transacao.conta_bancos_destino_id,
    banco_destino.image AS imagem_banco_destino,
    ROUND(transacao.valor, 2) AS valor,
    transacao.tipo_operacao,
    transacao.descricao,
    banco_destino.name AS nome_banco_destino,
    (SELECT 
            SUM(c.saldo)
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldoTotalGeral
FROM
    transacao
        JOIN
    conta_bancos AS conta_origem ON conta_origem.id_contaBancos = transacao.conta_flux_origem_id
        JOIN
    usuario ON usuario.id_usuario = conta_origem.usuario_id
        JOIN
    conta_bancaria AS conta_bancaria_origem ON conta_bancaria_origem.id_conta = conta_origem.contaBancaria_id
        JOIN
    banco AS banco_origem ON banco_origem.id_banco = conta_bancaria_origem.banco_id
        JOIN
    conta_bancos AS conta_destino ON conta_destino.id_contaBancos = transacao.conta_bancos_destino_id
        JOIN
    conta_bancaria AS conta_bancaria_destino ON conta_bancaria_destino.id_conta = conta_destino.contaBancaria_id
        JOIN
    banco AS banco_destino ON banco_destino.id_banco = conta_bancaria_destino.banco_id
WHERE
    usuario.id_usuario = :id_user
ORDER BY transacao.data_transacao DESC
LIMIT 10;
    `,
      {
        replacements: { id_user, limit },
        type: QueryTypes.SELECT
      }
    );
    if (query.length === 0) {
      const queryIfNotTransaction = await Usuario.sequelize.query(
        `
        SELECT 
            a.nome
        FROM
            usuario a
        WHERE
            a.id_usuario = :id_user `,
        {
          replacements: { id_user },
          type: QueryTypes.SELECT
        }
      );
      return { status: 200, data: queryIfNotTransaction };
    }
    return { status: 200, data: query, nome };
  };
};
module.exports = HomeRepository;
