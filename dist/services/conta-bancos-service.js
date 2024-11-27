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
    var ContaBancaria2 = class extends Model {
      static init(sequelize2) {
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
          sequelize: sequelize2,
          modelName: "Conta",
          tableName: "conta_bancaria"
        });
      }
    };
    ContaBancaria2.init(conexao);
    module2.exports = ContaBancaria2;
  }
});

// src/models/usuario.js
var require_usuario = __commonJS({
  "src/models/usuario.js"(exports2, module2) {
    var conexao = require_database();
    var { DataTypes, Model } = require("sequelize");
    var Usuario2 = class extends Model {
      static init(sequelize2) {
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
          sequelize: sequelize2,
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
    var Banco = class extends Model {
      static init(sequelize2) {
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
          sequelize: sequelize2,
          modelName: "Banco",
          tableName: "banco"
        });
      }
    };
    module2.exports = Banco;
  }
});

// src/models/conta-bancos.js
var require_conta_bancos = __commonJS({
  "src/models/conta-bancos.js"(exports2, module2) {
    var { DataTypes, Model, Sequelize } = require("sequelize");
    var Usuario2 = require_usuario();
    var ContaBancaria2 = require_conta_bancaria();
    var Banco = require_banco();
    var ContaBancos2 = class extends Model {
      static init(sequelize2) {
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
                model: ContaBancaria2,
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
            sequelize: sequelize2,
            tableName: "conta_bancos",
            timestamps: true
          }
        );
      }
    };
    module2.exports = ContaBancos2;
  }
});

// src/models/transacao.js
var require_transacao = __commonJS({
  "src/models/transacao.js"(exports2, module2) {
    var conexao = require_database();
    var { Sequelize, DataTypes, Model } = require("sequelize");
    var ContaBancos2 = require_conta_bancos();
    var Transacao2 = class extends Model {
      static init(sequelize2) {
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
          sequelize: sequelize2,
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

// src/repositories/conta-bancaria-repository.js
var require_conta_bancaria_repository = __commonJS({
  "src/repositories/conta-bancaria-repository.js"(exports2, module2) {
    var Conta = require_conta_bancaria();
    var Usuario2 = require_usuario();
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
        const usuario = await Usuario2.findByPk(body.fkUsuarioId);
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

// src/models/pix.js
var require_pix = __commonJS({
  "src/models/pix.js"(exports2, module2) {
    var conexao = require_database();
    var { Sequelize, DataTypes, Model, DATE } = require("sequelize");
    var Pix = class extends Model {
      static init(sequelize2) {
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
          sequelize: sequelize2,
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
    var { where: where2 } = require("sequelize");
    var Pix = require_pix();
    var axios = require("axios");
    require("dotenv").config();
    var PixAuthService = class {
      static returnAccessToken = async () => {
        const body = {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "client_credentials"
        };
        try {
          const response = await axios.post("https://login-api-sandbox.transfeera.com/authorization", body);
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

// src/models/index.js
var require_models = __commonJS({
  "src/models/index.js"(exports2, module2) {
    var conexao = require_database();
    var Banco = require_banco();
    var ContaBancaria2 = require_conta_bancaria();
    var ContaBancos2 = require_conta_bancos();
    var Pix = require_pix();
    var Transacao2 = require_transacao();
    var Usuario2 = require_usuario();
    ContaBancos2.init(conexao);
    Usuario2.init(conexao);
    Banco.init(conexao);
    ContaBancaria2.init(conexao);
    Pix.init(conexao);
    ContaBancos2.init(conexao);
    Transacao2.init(conexao);
    Usuario2.hasMany(ContaBancaria2, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancaria2.belongsTo(Usuario2, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos2.belongsTo(Usuario2, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos2.belongsTo(ContaBancaria2, { foreignKey: "contaBancaria_id", onDelete: "CASCADE" });
    Pix.hasOne(ContaBancos2, { foreignKey: "pix_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
    ContaBancos2.belongsTo(Pix, { foreignKey: "pix_id", onDelete: "CASCADE" });
    ContaBancaria2.belongsTo(Banco, { foreignKey: "banco_id" });
    Banco.hasMany(ContaBancaria2, { foreignKey: "banco_id" });
    module2.exports = {
      Usuario: Usuario2,
      Banco,
      ContaBancaria: ContaBancaria2,
      Pix,
      ContaBancos: ContaBancos2,
      Transacao: Transacao2
    };
  }
});

// src/repositories/pix-repository.js
var require_pix_repository = __commonJS({
  "src/repositories/pix-repository.js"(exports2, module2) {
    var { where: where2 } = require("sequelize");
    var Pix = require_pix();
    var axios = require("axios");
    var pixAuthService = require_auth_transfeera_service();
    var Usuario2 = require_usuario();
    var Banco = require_banco();
    var ContaBancos2 = require_conta_bancos();
    var { ContaBancaria: ContaBancaria2 } = require_models();
    require("dotenv").config();
    var PixRepository = class {
      static get = async (usuario_ID_TOKEN) => {
        const pixEncontrados = await ContaBancos2.findAll({
          include: [
            {
              model: Pix,
              attributes: ["id_pix", "key", "key_type", "created_at", "status"]
            },
            {
              model: ContaBancaria2,
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
          const usuario = await Usuario2.findByPk(body.usuario_id);
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
        const pixEncontrado = await ContaBancos2.findOne({
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

// src/repositories/conta-bancos-repository.js
var require_conta_bancos_repository = __commonJS({
  "src/repositories/conta-bancos-repository.js"(exports2, module2) {
    var pixRepository2 = require_pix_repository();
    var { ContaBancos: ContaBancos2, ContaBancaria: ContaBancaria2, Pix, Banco } = require_models();
    var ContaBancosRepository2 = class {
      // listar contas bancarias  do usuario
      static get = async (usuario_id_TOKEN) => {
        console.log("REPOSITORY", usuario_id_TOKEN);
        const contaEncontrada = await ContaBancos2.findAll({
          include: [
            {
              model: ContaBancaria2,
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
        const contaEncontrada = await ContaBancos2.findOne({
          include: [{
            model: ContaBancaria2
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
        const res = await ContaBancos2.create({
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
        return await ContaBancos2.update({ saldo: novoSaldo }, { where: { contaBancaria_id: id } });
      };
      // deletar conta bancaria do usuário
      static deletePix = async (idPix, usuario_id) => {
        try {
          const pixDelete = await pixRepository2.delete(idPix);
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
        const res = await ContaBancos2.findByPk(id);
        return res;
      };
    };
    module2.exports = ContaBancosRepository2;
  }
});

// src/services/conta-bancaria-service.js
var require_conta_bancaria_service = __commonJS({
  "src/services/conta-bancaria-service.js"(exports2, module2) {
    var ContaBancaria2 = require_conta_bancaria();
    var Transacao2 = require_transacao();
    var Usuario2 = require_usuario();
    var repository = require_conta_bancaria_repository();
    var ContaBancosrepository = require_conta_bancos_repository();
    var sequelize2 = require_database();
    var ContaBancariaService = class {
      static criarContaBancaria = async (fkUsuarioId, fkBancoId, saldo, tipo_conta) => {
        try {
          const tipo_conta_normalizado = String(tipo_conta).trim().toUpperCase();
          console.log(tipo_conta_normalizado);
          if (tipo_conta_normalizado !== "POUPANCA" && tipo_conta_normalizado !== "CORRENTE" && tipo_conta_normalizado !== "SALARIO") {
            return { message: "Tipo de conta banc\xE1ria inv\xE1lido", status: 400 };
          }
          const contaBancaria = await repository.post({
            fkUsuarioId,
            fkBancoId,
            tipo_conta: tipo_conta_normalizado,
            saldo
          });
          if (!contaBancaria.data) {
            return { message: contaBancaria.message, status: contaBancaria.status || 500 };
          }
          return { data: contaBancaria.data, status: 201 };
        } catch (error) {
          console.error("Erro ao criar conta banc\xE1ria:", error);
          return {
            message: "Falha na requisi\xE7\xE3o: " + error.message,
            status: 500
          };
        }
      };
      static atualizarSaldo = async (contaID, valor, fkUsuarioId, descricao, fkBancoId, contaBancos_id) => {
        const t = await sequelize2.transaction();
        try {
          const contaBancariaEncontrada = await ContaBancaria2.findOne({
            where: {
              id_conta: contaID,
              usuario_id: fkUsuarioId
            }
          });
          if (!contaBancariaEncontrada) {
            await t.rollback();
            return { message: "Conta n\xE3o encontrada ou inexistente", status: 404 };
          }
          const usuario = await Usuario2.findByPk(fkUsuarioId);
          if (!usuario) {
            await t.rollback();
            return { message: `Voc\xEA ainda n\xE3o possui uma conta banc\xE1ria para atualiz\xE1-la`, status: 404 };
          }
          if (contaBancariaEncontrada.usuario_id !== usuario.id_usuario) {
            await t.rollback();
            return { message: "Esta conta j\xE1 pertence a outro usu\xE1rio", status: 403 };
          }
          const conta = await repository.getById(contaID);
          if (!conta) {
            await t.rollback();
            return { message: conta.message, status: conta.status || 500 };
          }
          const saldoAtual = parseFloat(conta.data.saldo);
          const novoSaldo = saldoAtual + parseFloat(valor);
          if (novoSaldo < 0) {
            await t.rollback();
            return { message: "Voc\xEA n\xE3o possui saldo o suficiente em sua conta!", status: 400 };
          }
          const saldoAtualizado = await repository.put(contaID, novoSaldo, fkUsuarioId);
          const tipoOperacao = valor >= 0 ? "deposito" : "retirada";
          const transacao = await Transacao2.create({
            conta_id: contaID,
            valor,
            data_transacao: /* @__PURE__ */ new Date(),
            tipo_operacao: tipoOperacao,
            descricao,
            usuario_id: fkUsuarioId,
            banco_id: fkBancoId,
            conta_flux_origem_id: contaBancos_id
          }, { transaction: t });
          await t.commit();
          return { data: saldoAtualizado.data.previous, status: 201 };
        } catch (error) {
          await t.rollback();
          console.error("Erro ao atualizar saldo:", error);
          return {
            message: "Falha na requisi\xE7\xE3o: " + error.message,
            status: 500
          };
        }
      };
    };
    module2.exports = ContaBancariaService;
  }
});

// src/services/conta-bancos-service.js
var ContaBancaria = require_conta_bancaria();
var Transacao = require_transacao();
var Usuario = require_usuario();
var contaBancariaRepository = require_conta_bancaria_repository();
var contaBancosrepository = require_conta_bancos_repository();
var pixRepository = require_pix_repository();
var sequelize = require_database();
var { ContaBancos } = require_models();
var { where } = require("sequelize");
var contaBancariaService = require_conta_bancaria_service();
var { verify } = require("jsonwebtoken");
var ContaBancosRepository = require_conta_bancos_repository();
var ContaBancosService = class _ContaBancosService {
  static realizarTransferencia = async (conta_bancaria_origem_id, valor_transferencia, fkUsuarioId, descricao_transacao, id_conta_bancaria_destino) => {
    const t = await sequelize.transaction();
    try {
      const usuario = await Usuario.findByPk(fkUsuarioId);
      if (!usuario) {
        await t.rollback();
        return {
          message: `Voc\xEA ainda n\xE3o possui uma conta banc\xE1ria para realizar a transfer\xEAncia`,
          status: 404
        };
      }
      const contaBancaria = await _ContaBancosService.buscarContaBancaria(
        conta_bancaria_origem_id,
        fkUsuarioId
      );
      if (!contaBancaria || !contaBancaria.data) {
        await t.rollback();
        return { message: contaBancaria.message, status: contaBancaria.status };
      }
      const contaDestino = await _ContaBancosService.buscarContaBancaria(
        id_conta_bancaria_destino,
        fkUsuarioId
      );
      if (!contaDestino) {
        await t.rollback();
        return { message: "Conta de destino n\xE3o encontrada", status: 404 };
      }
      const saldoAtual = parseFloat(contaBancaria.data.Contum.saldo);
      if (valor_transferencia > saldoAtual) {
        await t.rollback();
        return {
          message: "Voc\xEA n\xE3o possui saldo o suficiente em sua conta!",
          status: 400
        };
      }
      const novoSaldoOrigem = saldoAtual - parseFloat(valor_transferencia);
      const saldoDestino = parseFloat(contaDestino.data.Contum.saldo);
      const novoSaldoDestino = saldoDestino + parseFloat(valor_transferencia);
      if (contaDestino.data.Pix.status === "VALIDANDO") {
        console.log(
          "N\xE3o \xE9 possivel realizar transfer\xEAncias se sua chave pix n\xE3o est\xE1 registrada"
        );
        return {
          message: "N\xE3o \xE9 possivel realizar transfer\xEAncias se sua chave pix n\xE3o est\xE1 registrada",
          status: 400
        };
      }
      if (contaDestino.data.id_contaBancos === contaBancaria.data.id_contaBancos) {
        console.log(
          "Voc\xEA n\xE3o pode realizar uma transfer\xEAncia para uma mesma conta banc\xE1ria"
        );
        return {
          message: "Voc\xEA n\xE3o pode realizar uma transfer\xEAncia para uma mesma conta banc\xE1ria",
          status: 400
        };
      }
      await Promise.all([
        contaBancariaRepository.put(
          contaBancaria.data.Contum.id_conta,
          novoSaldoOrigem,
          contaBancaria.data.usuario_id,
          { transaction: t }
        ),
        contaBancariaRepository.put(
          contaDestino.data.Contum.id_conta,
          novoSaldoDestino,
          contaDestino.data.usuario_id,
          { transaction: t }
        )
      ]);
      await _ContaBancosService.registrarTransacao({
        valor: -valor_transferencia,
        data_transacao: /* @__PURE__ */ new Date(),
        tipo_operacao: "transfer\xEAncia",
        descricao: descricao_transacao,
        usuario_id: fkUsuarioId,
        conta_flux_origem_id: conta_bancaria_origem_id,
        conta_bancos_destino_id: id_conta_bancaria_destino
      }, { transaction: t });
      await _ContaBancosService.registrarTransacao({
        valor: valor_transferencia,
        data_transacao: /* @__PURE__ */ new Date(),
        tipo_operacao: "dep\xF3sito",
        descricao: descricao_transacao,
        usuario_id: fkUsuarioId,
        conta_flux_origem_id: conta_bancaria_origem_id,
        conta_bancos_destino_id: id_conta_bancaria_destino
      }, { transaction: t });
      console.log("-----------------------------------------------------------------");
      await t.commit();
      const contaBancariaUpdate = await contaBancosrepository.findOne({
        contaBancaria_id: conta_bancaria_origem_id,
        usuario_id: fkUsuarioId
      });
      return {
        message: "Transfer\xEAncia realizada com sucesso",
        data: contaBancariaUpdate.data,
        status: 201
      };
    } catch (error) {
      await t.rollback();
      return {
        message: "Falha na requisi\xE7\xE3o: " + error.message,
        status: 500
      };
    }
  };
  static buscarContasDoFlux = async (fkUsuarioId) => {
    console.log("SERVICE", fkUsuarioId);
    const res = await contaBancosrepository.get(fkUsuarioId);
    if (!res) {
      return { message: res.message, status: res.status };
    }
    return { data: res.data, status: res.status };
  };
  static async buscarContaBancaria(contaBancaria_id, usuario_id) {
    const conta = await contaBancosrepository.findOne({
      contaBancaria_id,
      usuario_id
    });
    if (!conta) {
      return { message: "Conta n\xE3o encontrada", status: 404 };
    }
    return { data: conta.data, status: conta.status };
  }
  static async verificarSaldoSuficiente(contaBancaria_id, usuario_id, valor) {
    const conta_id = contaBancaria_id;
    const conta = await ContaBancosRepository.findOne({ conta_id, usuario_id });
    const saldoDisponivelNaConta = await conta.data.Contum.saldo;
    if (saldoDisponivelNaConta < valor) {
      return {
        message: "Voc\xEA n\xE3o possui saldo o suficiente em sua conta!",
        status: 400
      };
    }
    return { data: conta.data, status: conta.status };
  }
  static async atualizarSaldoConta(idConta, novoSaldo) {
    await contaBancariaRepository.update(
      { saldo: novoSaldo },
      { where: { id: idConta } }
    );
  }
  static async registrarTransacao(dadosTransacao) {
    console.log("--------------------------------------------");
    console.log(dadosTransacao);
    console.log("--------------------------------------------");
    const res = await Transacao.create(dadosTransacao);
    return { data: res };
  }
};
module.exports = ContaBancosService;
