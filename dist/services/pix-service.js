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

// src/models/pix.js
var require_pix = __commonJS({
  "src/models/pix.js"(exports2, module2) {
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
    module2.exports = Pix;
  }
});

// src/services/auth-transfeera-service.js
var require_auth_transfeera_service = __commonJS({
  "src/services/auth-transfeera-service.js"(exports2, module2) {
    var { where } = require("sequelize");
    var Pix = require_pix();
    var axios2 = require("axios");
    require("dotenv").config();
    var PixAuthService = class {
      static returnAccessToken = async () => {
        const body = {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "client_credentials"
        };
        try {
          const response = await axios2.post("https://login-api-sandbox.transfeera.com/authorization", body);
          if (response.data && response.data.access_token) {
            return response.data.access_token;
          } else {
            throw new Error("Failed to retrieve access token");
          }
        } catch (error) {
          console.error("Error obtaining access token:", error);
          throw error;
        }
      };
    };
    module2.exports = PixAuthService;
  }
});

// src/models/usuario.js
var require_usuario = __commonJS({
  "src/models/usuario.js"(exports2, module2) {
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
    module2.exports = Usuario;
  }
});

// src/models/banco.js
var require_banco = __commonJS({
  "src/models/banco.js"(exports2, module2) {
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
    module2.exports = Banco;
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

// src/models/conta-bancos.js
var require_conta_bancos = __commonJS({
  "src/models/conta-bancos.js"(exports2, module2) {
    var { DataTypes, Model, Sequelize } = require("sequelize");
    var Usuario = require_usuario();
    var ContaBancaria = require_conta_bancaria();
    var Banco = require_banco();
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
              type: Sequelize.UUID,
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
    var { Sequelize, DataTypes, Model } = require("sequelize");
    var ContaBancos = require_conta_bancos();
    var Transacao = class extends Model {
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
    Transacao.init(conexao);
    module2.exports = Transacao;
  }
});

// src/models/index.js
var require_models = __commonJS({
  "src/models/index.js"(exports2, module2) {
    var conexao = require_database();
    var Banco = require_banco();
    var ContaBancaria = require_conta_bancaria();
    var ContaBancos = require_conta_bancos();
    var Pix = require_pix();
    var Transacao = require_transacao();
    var Usuario = require_usuario();
    ContaBancos.init(conexao);
    Usuario.init(conexao);
    Banco.init(conexao);
    ContaBancaria.init(conexao);
    Pix.init(conexao);
    ContaBancos.init(conexao);
    Transacao.init(conexao);
    Usuario.hasMany(ContaBancaria, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancaria.belongsTo(Usuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos.belongsTo(Usuario, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos.belongsTo(ContaBancaria, { foreignKey: "contaBancaria_id", onDelete: "CASCADE" });
    Pix.hasOne(ContaBancos, { foreignKey: "pix_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
    ContaBancos.belongsTo(Pix, { foreignKey: "pix_id", onDelete: "CASCADE" });
    ContaBancaria.belongsTo(Banco, { foreignKey: "banco_id" });
    Banco.hasMany(ContaBancaria, { foreignKey: "banco_id" });
    conexao.sync({ alter: true });
    module2.exports = {
      Usuario,
      Banco,
      ContaBancaria,
      Pix,
      ContaBancos,
      Transacao
    };
  }
});

// src/repositories/pix-repository.js
var require_pix_repository = __commonJS({
  "src/repositories/pix-repository.js"(exports2, module2) {
    var { where } = require("sequelize");
    var Pix = require_pix();
    var axios2 = require("axios");
    var pixAuthService = require_auth_transfeera_service();
    var Usuario = require_usuario();
    var Banco = require_banco();
    var ContaBancos = require_conta_bancos();
    var { ContaBancaria } = require_models();
    require("dotenv").config();
    var PixRepository = class {
      static get = async (usuario_ID_TOKEN) => {
        const pixEncontrados = await ContaBancos.findAll({
          include: [
            {
              model: Pix,
              attributes: ["id_pix", "key", "key_type", "created_at", "status"]
            },
            {
              model: ContaBancaria,
              include: [
                {
                  model: Banco,
                  attributes: ["id_banco", "name", "image"]
                }
              ]
            }
          ],
          where: {
            usuario_id: usuario_ID_TOKEN
          },
          attributes: []
        });
        if (pixEncontrados.length === 0) {
          return {
            message: "Pix n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        return { data: pixEncontrados, status: 200 };
      };
      static post = async (body) => {
        try {
          const usuario = await Usuario.findByPk(body.usuario_id);
          const key_type = body.key_type.toUpperCase();
          if (!usuario) {
            return {
              message: `O usu\xE1rio n\xE3o encontrado`,
              status: 404
            };
          }
          const pix = await Pix.create({
            id_pix: body.id_pix,
            key: body.key,
            key_type,
            usuario_id: body.usuario_id,
            created_at: /* @__PURE__ */ new Date(),
            updated_at: /* @__PURE__ */ new Date(),
            status: key_type == "CNPJ" || key_type == "CHAVE_ALEATORIA" ? "REGISTRADA" : "VALIDANDO"
          });
          if (!pix) {
            return { status: 400, message: "Erro ao criar chave PIX" };
          }
          return { data: pix, status: 201 };
        } catch (error) {
          console.error("Error creating PIX entry:", error);
          return {
            message: "Falha ao criar criar chave PIX: " + error.message,
            status: 500
          };
        }
      };
      static findById = async (id) => {
        const pixEncontrados = await Pix.findByPk({
          where: {
            usuario_id: id
          }
        });
        if (pixEncontrados.length === 0) {
          return {
            message: "Pix n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        return { data: pixEncontrados, status: 200 };
      };
      static findByPixAndUserId = async (pixKey_id, usuario_id) => {
        const pixEncontrado = await ContaBancos.findOne({
          include: [
            {
              model: Pix,
              attributes: ["id_pix", "key", "key_type", "created_at", "status"]
            }
          ],
          where: {
            usuario_id
          },
          attributes: []
        });
        if (!pixEncontrado) {
          return {
            message: "Chave Pix n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        return { data: pixEncontrado, status: 200 };
      };
      static put = async (body) => {
        const updatePix = await Pix.update(
          {
            status: body.status
          },
          {
            where: {
              id_pix: body.id_pix
            }
          }
        );
        if (!updatePix) {
          return {
            message: "Erro ao atualizar chave",
            status: 404
          };
        }
        return { data: updatePix, status: 200 };
      };
      static delete = async (idPix) => {
        const chaveDeletada = await Pix.destroy({
          where: {
            id_pix: idPix
          }
        });
        if (chaveDeletada === 0) {
          return {
            message: "Chave n\xE3o encontrada ou n\xE3o autorizada para exclus\xE3o",
            status: 404
          };
        }
        return { status: 200 };
      };
      static findByKey = async (key) => {
        const chaveExistente = await Pix.findOne({
          where: { key }
        });
        if (chaveExistente) {
          return {
            message: "Chave PIX fornecida j\xE1 existe",
            status: 400
          };
        }
        return { data: chaveExistente, status: 200 };
      };
    };
    module2.exports = PixRepository;
  }
});

// src/repositories/conta-bancaria-repository.js
var require_conta_bancaria_repository = __commonJS({
  "src/repositories/conta-bancaria-repository.js"(exports2, module2) {
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
    module2.exports = ContaBancariaRepository;
  }
});

// src/repositories/conta-bancos-repository.js
var require_conta_bancos_repository = __commonJS({
  "src/repositories/conta-bancos-repository.js"(exports2, module2) {
    var pixRepository = require_pix_repository();
    var { ContaBancos, ContaBancaria, Pix, Banco } = require_models();
    var ContaBancosRepository = class {
      // listar contas bancarias  do usuario
      static get = async (usuario_id_TOKEN) => {
        console.log("REPOSITORY", usuario_id_TOKEN);
        const contaEncontrada = await ContaBancos.findAll({
          include: [
            {
              model: ContaBancaria,
              include: { model: Banco }
            },
            {
              model: Pix
            }
          ],
          where: {
            usuario_id: usuario_id_TOKEN
          }
        });
        if (!contaEncontrada) {
          return {
            message: "Voc\xEA n\xE3o possui contas banc\xE1rias dispon\xEDveis para realizar transa\xE7\xF5es",
            status: 404
          };
        }
        const res = contaEncontrada;
        return { data: res, status: 200 };
      };
      static findOne = async (body) => {
        const contaEncontrada = await ContaBancos.findOne({
          include: [{
            model: ContaBancaria
          }, { model: Pix }],
          where: {
            usuario_id: body.usuario_id,
            id_contaBancos: body.contaBancaria_id
          }
        });
        if (!contaEncontrada) {
          return {
            message: "Conta n\xE3o encontrada ou inexistente",
            status: 404
          };
        }
        const res = contaEncontrada;
        return { data: res, status: 200 };
      };
      // relacionar o pix com a conta bancos
      static post = async (body) => {
        const res = await ContaBancos.create({
          pix_id: body.id_pix,
          usuario_id: body.usuario_id,
          contaBancaria_id: body.contaBancaria_id,
          banco_id: body.banco_id
        });
        if (!res) {
          return {
            message: "Erro ao vincular chave pix e conta bancaria",
            status: 400
          };
        }
        return { data: `Chave vinculada com sucesso! 
 ${res}`, status: 201 };
      };
      // atualizar conta bancaria do usuário
      static put = async (id, novoSaldo) => {
        return await ContaBancos.update({ saldo: novoSaldo }, { where: { contaBancaria_id: id } });
      };
      // deletar conta bancaria do usuário
      static deletePix = async (idPix, usuario_id) => {
        try {
          const pixDelete = await pixRepository.delete(idPix);
          if (!pixDelete) {
            return {
              message: "Erro deletar conta bancaria",
              status: 400
            };
          }
          return { data: "Chave Pix deletada com sucesso!", status: 200 };
        } catch (error) {
          console.error(error);
          return {
            message: "Erro ao deletar entradas da tabela ContaBancos",
            status: 500
          };
        }
      };
      // Buscar conta pelo ID dela
      static getById = async (id) => {
        const res = await ContaBancos.findByPk(id);
        return res;
      };
    };
    module2.exports = ContaBancosRepository;
  }
});

// src/services/pix-service.js
var axios = require("axios");
var repository = require_pix_repository();
var contaBancariaRepository = require_conta_bancaria_repository();
var contaBancosRepository = require_conta_bancos_repository();
require("dotenv").config();
var PixService = class {
  static criarChave = async (key_type, key, dadosUsuario, accessToken, banco_id, contaBancaria_id) => {
    try {
      const usuario_id = dadosUsuario.id;
      const key_typeUpCase = key_type.toUpperCase();
      const chaveExistente = await this.procurarChaveExistente(key);
      console.warn(chaveExistente);
      if (chaveExistente) {
        return {
          status: chaveExistente.status,
          message: chaveExistente.message
        };
      }
      const contasBancariasDisponiveis = await contaBancariaRepository.findOne({
        contaBancaria_id,
        usuario_id
      });
      if (!contasBancariasDisponiveis.data) {
        return {
          message: contasBancariasDisponiveis.message,
          status: contasBancariasDisponiveis.status
        };
      }
      const contaBancariaUsuario = contasBancariasDisponiveis.data.id_conta;
      if (key_typeUpCase == "CNPJ") {
        let response = await this.cadastrarChavePixCNPJouAleatoria(
          key,
          key_type,
          usuario_id,
          banco_id,
          contaBancariaUsuario
        );
        return response;
      } else {
        const options = {
          method: "POST",
          url: "https://api-sandbox.transfeera.com/pix/key",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            "user-Agent": dadosUsuario.email,
            Authorization: `Bearer ${accessToken}`
          },
          data: { key, key_type: key_typeUpCase }
        };
        const response = await axios.request(options);
        const createdKey = response.data;
        const id_pix = createdKey.id;
        const pix = await repository.post({
          id_pix,
          key: createdKey.key,
          key_type: createdKey.key_type,
          usuario_id: dadosUsuario.id
        });
        const contaBancos = await contaBancosRepository.post({
          id_pix,
          usuario_id: dadosUsuario.id,
          contaBancaria_id: contaBancariaUsuario,
          banco_id
        });
        if (!contaBancos) {
          return { message: contaBancos.message, status: contaBancos.status };
        }
        if (pix.status === 201) {
          return { status: pix.status, data: createdKey };
        } else if (pix.status === 409) {
          return {
            status: pix.status || 500,
            message: response.data.statusCode
          };
        } else {
          return {
            status: pix.status || 500,
            message: response.data.statusCode
          };
        }
      }
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return {
          status: 400,
          message: "Chave Pix j\xE1 registrada no banco de dados"
        };
      }
      if (error.response && error.response.data) {
        return {
          status: error.response.data.statusCode || 500,
          message: error.response.data.message
        };
      } else {
        return {
          status: 500,
          message: "Erro interno do servidor"
        };
      }
    }
  };
  static verificarChave = async (idPix, emailUsuario, accessToken, verifyCode) => {
    try {
      if (verifyCode.length !== 6) {
        return {
          message: "A chave deve conter apenas 6 d\xEDgitos num\xE9ricos",
          status: 400
        };
      }
      const verifyOptions = {
        method: "PUT",
        url: `https://api-sandbox.transfeera.com/pix/key/${idPix}/verify`,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "User-Agent": emailUsuario,
          Authorization: `Bearer ${accessToken}`
        },
        data: { code: verifyCode }
      };
      const verifyResponse = await axios.request(verifyOptions);
      const statusOptions = {
        method: "GET",
        url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
        headers: {
          accept: "application/json",
          "User-Agent": emailUsuario,
          Authorization: `Bearer ${accessToken}`
        }
      };
      const statusResponse = await axios.request(statusOptions);
      const keyRegistredStatus = statusResponse.data.status;
      const updatedStatus = keyRegistredStatus == "REGISTRADA" ? "REGISTRADA" : keyRegistredStatus;
      const updateResult = await repository.put({
        id_pix: idPix,
        status: updatedStatus
      });
      if (!updateResult.data) {
        return {
          message: "Erro ao atualizar chave",
          status: 500
        };
      }
      return {
        data: statusResponse.data,
        status: 200
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return {
          message: error.response.data.message,
          status: error.response.data.statusCode || 500
        };
      } else {
        return {
          message: "Erro interno do servidor",
          status: 500
        };
      }
    }
  };
  static reenviarCodigo = async (idPix, emailUsuario, accessToken) => {
    try {
      const verifyOptions = {
        method: "PUT",
        url: `https://api-sandbox.transfeera.com/pix/key/${idPix}/resendVerificationCode`,
        headers: {
          accept: "application/json",
          "User-Agent": emailUsuario,
          authorization: `Bearer ${accessToken}`
        }
      };
      const verifyResponse = await axios.request(verifyOptions);
      const statusOptions = {
        method: "GET",
        url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
        headers: {
          accept: "application/json",
          "User-Agent": emailUsuario,
          Authorization: `Bearer ${accessToken}`
        }
      };
      const statusResponse = await axios.request(statusOptions);
      const keyRegistredStatus = statusResponse.data.status;
      const updatedStatus = keyRegistredStatus === "REGISTRADA" ? "REGISTRADA" : keyRegistredStatus;
      const updateResult = await repository.put({
        id_pix: idPix,
        status: updatedStatus
      });
      if (!updateResult.data) {
        return {
          message: "Erro ao atualizar chave",
          status: 500
        };
      }
      return {
        data: statusResponse.data,
        status: 200
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return {
          message: error.response.data.message,
          status: error.response.data.statusCode || 500
        };
      } else {
        return {
          message: "Erro interno do servidor",
          status: 500
        };
      }
    }
  };
  static deletarChave = async (idPix, usuario_id, emailUsuario, accessToken) => {
    try {
      const contasBancariasDisponiveis = await contaBancosRepository.findOne({
        idPix,
        usuario_id
      });
      if (!contasBancariasDisponiveis || !contasBancariasDisponiveis.data) {
        return {
          message: "Conta banc\xE1ria n\xE3o encontrada ou inexistente",
          status: 404
        };
      }
      const contaBancosUsuarioID = contasBancariasDisponiveis.data.usuario_id;
      if (!contasBancariasDisponiveis) {
        return {
          message: contasBancariasDisponiveis.message,
          status: contasBancariasDisponiveis.status
        };
      }
      const contaBancosDelete = await contaBancosRepository.deletePix(
        idPix,
        contaBancosUsuarioID
      );
      if (contaBancosDelete.status !== 200) {
        return {
          message: contaBancosDelete.message,
          status: contaBancosDelete.status
        };
      }
      const options = {
        method: "DELETE",
        url: `https://api-sandbox.transfeera.com/pix/key/${idPix}`,
        headers: {
          accept: "application/json",
          "User-Agent": emailUsuario,
          Authorization: `Bearer ${accessToken}`
        }
      };
      const response = await axios.request(options);
      if (response && contaBancosDelete.status === 200) {
        return {
          data: contaBancosDelete.data,
          status: contaBancosDelete.status
        };
      } else {
        return {
          message: contaBancosDelete.message,
          status: contaBancosDelete.status
        };
      }
    } catch (error) {
      return {
        message: error.response ? error.response.data.message : "Erro interno do servidor",
        status: error.response ? error.response.status : 500
      };
    }
  };
  static buscarChaveId = async (idPix, dadosUsuario, accessToken) => {
    try {
      const emailUsuario = dadosUsuario.email;
      const usuario_id = dadosUsuario.id;
      const pixUser = await repository.findByPixAndUserId(idPix, usuario_id);
      if (pixUser.status !== 200) {
        return {
          message: pixUser.message,
          status: pixUser.status
        };
      }
      const pixId = pixUser.data.Pix.id_pix;
      const options = {
        method: "GET",
        url: `https:api-sandbox.transfeera.com/pix/key/${pixId}`,
        headers: {
          accept: "application/json",
          "User-Agent": emailUsuario,
          authorization: `Bearer ${accessToken}`
        }
      };
      const response = await axios.request(options);
      console.log(response);
      if (pixUser.status === 200) {
        return { data: response.data, status: pixUser.status };
      } else {
        return { message: pixUser.message, status: pixUser.status };
      }
    } catch (error) {
      if (error.response && error.response.data) {
        return {
          message: error.response.data.message,
          status: error.response.data.statusCode || 500
        };
      } else {
        return {
          message: "Erro interno do servidor",
          status: 500
        };
      }
    }
  };
  static cadastrarChavePixCNPJouAleatoria = async (key, key_type, usuario_id, banco_id, contaBancariaUsuarioID) => {
    let key_typeUpCase = key_type.toUpperCase();
    const pix = await repository.post({
      key,
      key_type: key_typeUpCase,
      usuario_id
    });
    const contaBancos = await contaBancosRepository.post({
      id_pix: pix.data.id_pix,
      usuario_id,
      contaBancaria_id: contaBancariaUsuarioID,
      banco_id
    });
    if (!contaBancos) {
      return { message: contaBancos.message, status: contaBancos.status };
    }
    if (pix.status === 201) {
      return { status: pix.status, data: pix.data };
    } else {
      return { status: pix.status || 500, message: pix.message };
    }
  };
  static procurarChaveExistente = async (key) => {
    const chaveExistente = await repository.findByKey(key);
    if (chaveExistente.status == 400) {
      return {
        status: chaveExistente.status,
        message: chaveExistente.message
      };
    }
    return chaveExistente.data;
  };
};
module.exports = PixService;
