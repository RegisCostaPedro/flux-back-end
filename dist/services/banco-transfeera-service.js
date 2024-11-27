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

// src/repositories/banco-repository.js
var require_banco_repository = __commonJS({
  "src/repositories/banco-repository.js"(exports2, module2) {
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
    module2.exports = BancoRepository;
  }
});

// src/services/banco-transfeera-service.js
var { where } = require("sequelize");
var Pix = require_pix();
var axios = require("axios");
var authServiceAPI = require_auth_transfeera_service();
var authService = require_auth_service();
var bancoRepository = require_banco_repository();
require("dotenv").config();
var BancoService = class {
  static returnListBanks = async (USUARIO_TOKEN, nomeInstituicao) => {
    try {
      const res = await bancoRepository.get();
      if (res) {
        return { data: res.data, status: res.status };
      }
    } catch (error) {
      console.error("Error obtaining list of banks:", error);
      throw error;
    }
  };
  static cadastrarInstituicoes = async (USUARIO_TOKEN) => {
    try {
      const accessToken = await authServiceAPI.returnAccessToken();
      const options = {
        method: "GET",
        url: `https://api-sandbox.transfeera.com/bank?pix=true`,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "user-Agent": USUARIO_TOKEN.email,
          Authorization: `Bearer ${accessToken}`
        }
      };
      const response = await axios.request(options);
      let bancos = response.data;
      const cadastrandoBancos = await Promise.all(bancos.map(async (banco) => {
        const { id, name, code = "DEFAULT_CODE", ispb, image, spi_participant_type } = banco;
        if (!name || !ispb || !spi_participant_type) {
          throw new Error(`Dados inv\xE1lidos para o banco com id ${id}`);
        }
        return bancoRepository.post({
          id,
          name,
          code,
          ispb,
          image,
          spi_participant_type
        });
      }));
      return bancos;
    } catch (error) {
      console.error("Error obtaining list of banks:", error);
      throw error;
    }
  };
  static findBankById = (banks, bankId) => {
    return banks.find((bank) => bank.id === bankId);
  };
};
module.exports = BancoService;
