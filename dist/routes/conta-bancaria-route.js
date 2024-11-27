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

// src/services/auth-service.js
var require_auth_service = __commonJS({
  "src/services/auth-service.js"(exports2, module2) {
    var jwt = require("jsonwebtoken");
    var AuthService = class _AuthService {
      static generateToken = async (data) => {
        const TokenExpirationTime = "1d";
        return jwt.sign(data, global.SALT_KEY, { expiresIn: TokenExpirationTime });
      };
      static decodeToken = async (token) => {
        try {
          return await jwt.verify(token, global.SALT_KEY);
        } catch (error) {
          throw new Error("Token inv\xE1lido ou expirado.");
        }
      };
      static authorize = async (req, res, next) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          if (!token) {
            return res.status(401).json({ message: "Acesso restrito: token n\xE3o fornecido." });
          }
          await _AuthService.decodeToken(token);
          next();
        } catch (error) {
          res.status(401).json({ message: "Token inv\xE1lido ou expirado." });
        }
      };
      static isAdmin = async (req, res, next) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          if (!token) {
            return res.status(401).json({ message: "Acesso restrito: token n\xE3o fornecido." });
          }
          const decoded = await _AuthService.decodeToken(token);
          if (decoded.roles && decoded.roles.includes("admin")) {
            next();
          } else {
            res.status(403).json({ message: "Acesso restrito: administrador necess\xE1rio." });
          }
        } catch (error) {
          res.status(401).json({ message: "Token inv\xE1lido ou expirado." });
        }
      };
    };
    module2.exports = AuthService;
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
    var axios = require("axios");
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

// src/services/conta-bancaria-service.js
var require_conta_bancaria_service = __commonJS({
  "src/services/conta-bancaria-service.js"(exports2, module2) {
    var ContaBancaria = require_conta_bancaria();
    var Transacao = require_transacao();
    var Usuario = require_usuario();
    var repository = require_conta_bancaria_repository();
    var ContaBancosrepository = require_conta_bancos_repository();
    var sequelize = require_database();
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
        const t = await sequelize.transaction();
        try {
          const contaBancariaEncontrada = await ContaBancaria.findOne({
            where: {
              id_conta: contaID,
              usuario_id: fkUsuarioId
            }
          });
          if (!contaBancariaEncontrada) {
            await t.rollback();
            return { message: "Conta n\xE3o encontrada ou inexistente", status: 404 };
          }
          const usuario = await Usuario.findByPk(fkUsuarioId);
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
          const transacao = await Transacao.create({
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

// src/controllers/conta-bancaria-controller.js
var require_conta_bancaria_controller = __commonJS({
  "src/controllers/conta-bancaria-controller.js"(exports2, module2) {
    var repository = require_conta_bancaria_repository();
    var authService2 = require_auth_service();
    var service = require_conta_bancaria_service();
    var ContaController = class {
      static listarContasBancarias = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService2.decodeToken(token);
          const contas = await repository.get(dadosUsuario.id);
          if (contas.status === 200) {
            return res.status(contas.status).send(contas.data);
          } else {
            return res.status(contas.status).send({ message: contas.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o " + error
          });
        }
      };
      static criarContaBancaria = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService2.decodeToken(token);
          const saldo = parseFloat(req.body.saldo);
          const tipo_conta = req.body.tipo_conta;
          const fkUsuarioId = dadosUsuario.id;
          const fkBancoId = req.body.fkBancoId;
          const resultado = await service.criarContaBancaria(fkUsuarioId, fkBancoId, saldo, tipo_conta);
          if (resultado.status === 201) {
            return res.status(201).send(resultado.data);
          } else {
            return res.status(resultado.status).send({ message: resultado.message });
          }
        } catch (error) {
          throw error;
        }
      };
      static atualizarContaBancaria = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService2.decodeToken(token);
          const contaID = req.params.id;
          const valor = parseFloat(req.body.saldo);
          const descricao = req.body.descricao;
          const fkUsuarioId = dadosUsuario.id;
          const fkBancoId = req.body.banco_id;
          const resultado = await service.atualizarSaldo(
            contaID,
            valor,
            fkUsuarioId,
            descricao,
            fkBancoId
          );
          if (resultado.status === 201) {
            return res.status(201).send(resultado.data);
          } else {
            return res.status(resultado.status).send({ message: resultado.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o: " + error
          });
        }
      };
      static deletarContaBancaria = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService2.decodeToken(token);
          const conta = await repository.delete(req.params.id, dadosUsuario.id);
          if (conta.status === 201) {
            return res.status(conta.status).send(conta.data);
          } else {
            return res.status(conta.status).send({ message: conta.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o" + error
          });
        }
      };
      static buscarContasBancariasPorId = async (req, res) => {
        try {
          const token = req.body.token || req.query.token || req.headers["x-access-token"];
          const dadosUsuario = await authService2.decodeToken(token);
          const conta = await repository.getById(req.params.id, dadosUsuario.id);
          if (conta.status === 200) {
            return res.status(conta.status).send(conta.data);
          } else {
            return res.status(conta.status).send({ message: conta.message });
          }
        } catch (error) {
          res.status(500).send({
            message: "Falha ao processar requisi\xE7\xE3o" + error
          });
        }
      };
    };
    module2.exports = ContaController;
  }
});

// src/routes/conta-bancaria-route.js
var express = require("express");
var router = express.Router();
var controller = require_conta_bancaria_controller();
var authService = require_auth_service();
router.post("/criar-conta-bancaria", authService.authorize, controller.criarContaBancaria);
router.get("/listar-contas", authService.authorize, controller.listarContasBancarias);
router.put("/atualizar-conta/:id", authService.authorize, controller.atualizarContaBancaria);
router.delete("/deletar-conta/:id", authService.authorize, controller.deletarContaBancaria);
router.get("/bucar-conta/:id", authService.authorize, controller.buscarContasBancariasPorId);
module.exports = router;
