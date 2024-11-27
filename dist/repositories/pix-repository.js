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

// src/models/pix.js
var require_pix = __commonJS({
  "src/models/pix.js"(exports2, module2) {
    var conexao = require_database();
    var { Sequelize, DataTypes, Model, DATE } = require("sequelize");
    var Pix2 = class extends Model {
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
    module2.exports = Pix2;
  }
});

// src/services/auth-transfeera-service.js
var require_auth_transfeera_service = __commonJS({
  "src/services/auth-transfeera-service.js"(exports2, module2) {
    var { where: where2 } = require("sequelize");
    var Pix2 = require_pix();
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

// src/models/conta-bancaria.js
var require_conta_bancaria = __commonJS({
  "src/models/conta-bancaria.js"(exports2, module2) {
    var conexao = require_database();
    var { DataTypes, Model } = require("sequelize");
    var ContaBancaria2 = class extends Model {
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
    ContaBancaria2.init(conexao);
    module2.exports = ContaBancaria2;
  }
});

// src/models/conta-bancos.js
var require_conta_bancos = __commonJS({
  "src/models/conta-bancos.js"(exports2, module2) {
    var { DataTypes, Model, Sequelize } = require("sequelize");
    var Usuario2 = require_usuario();
    var ContaBancaria2 = require_conta_bancaria();
    var Banco2 = require_banco();
    var ContaBancos2 = class extends Model {
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
            sequelize,
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
    var Banco2 = require_banco();
    var ContaBancaria2 = require_conta_bancaria();
    var ContaBancos2 = require_conta_bancos();
    var Pix2 = require_pix();
    var Transacao = require_transacao();
    var Usuario2 = require_usuario();
    ContaBancos2.init(conexao);
    Usuario2.init(conexao);
    Banco2.init(conexao);
    ContaBancaria2.init(conexao);
    Pix2.init(conexao);
    ContaBancos2.init(conexao);
    Transacao.init(conexao);
    Usuario2.hasMany(ContaBancaria2, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancaria2.belongsTo(Usuario2, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos2.belongsTo(Usuario2, { foreignKey: "usuario_id", onDelete: "CASCADE" });
    ContaBancos2.belongsTo(ContaBancaria2, { foreignKey: "contaBancaria_id", onDelete: "CASCADE" });
    Pix2.hasOne(ContaBancos2, { foreignKey: "pix_id", onDelete: "CASCADE", onUpdate: "CASCADE" });
    ContaBancos2.belongsTo(Pix2, { foreignKey: "pix_id", onDelete: "CASCADE" });
    ContaBancaria2.belongsTo(Banco2, { foreignKey: "banco_id" });
    Banco2.hasMany(ContaBancaria2, { foreignKey: "banco_id" });
    module2.exports = {
      Usuario: Usuario2,
      Banco: Banco2,
      ContaBancaria: ContaBancaria2,
      Pix: Pix2,
      ContaBancos: ContaBancos2,
      Transacao
    };
  }
});

// src/repositories/pix-repository.js
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
module.exports = PixRepository;
