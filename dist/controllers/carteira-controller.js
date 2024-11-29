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

// src/repositories/usuario-repository.js
var require_usuario_repository = __commonJS({
  "src/repositories/usuario-repository.js"(exports2, module2) {
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
    module2.exports = UsarioRepository;
  }
});

// src/repositories/home-repository.js
var require_home_repository = __commonJS({
  "src/repositories/home-repository.js"(exports2, module2) {
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
    module2.exports = HomeRepository;
  }
});

// src/repositories/carteira-repository.js
var require_carteira_repository = __commonJS({
  "src/repositories/carteira-repository.js"(exports2, module2) {
    var { Sequelize, QueryTypes, where } = require("sequelize");
    var Transacao = require_transacao();
    var Banco = require_banco();
    var ContaBancaria = require_conta_bancaria();
    var CarteiraRepository = class {
      static get = async (id_user, limit) => {
        const query = await Banco.sequelize.query(
          `
  SELECT 
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
        JOIN conta_bancos AS conta_origem ON conta_origem.id_contaBancos = transacao.conta_flux_origem_id
        JOIN usuario ON usuario.id_usuario = conta_origem.usuario_id
        JOIN conta_bancaria AS conta_bancaria_origem ON conta_bancaria_origem.id_conta = conta_origem.contaBancaria_id
        JOIN banco AS banco_origem ON banco_origem.id_banco = conta_bancaria_origem.banco_id
        JOIN conta_bancos AS conta_destino ON conta_destino.id_contaBancos = transacao.conta_bancos_destino_id
        JOIN conta_bancaria AS conta_bancaria_destino ON conta_bancaria_destino.id_conta = conta_destino.contaBancaria_id
        JOIN banco AS banco_destino ON banco_destino.id_banco = conta_bancaria_destino.banco_id
WHERE
    usuario.id_usuario = :id_user
ORDER BY 
    transacao.data_transacao DESC
LIMIT 10;
    `,
          {
            replacements: { id_user, limit },
            type: QueryTypes.SELECT
          }
        );
        if (query.length === 0) {
          const queryIfNotTransaction = await ContaBancaria.sequelize.query(
            `
        SELECT 
            SUM(c.saldo) as saldoTotalGeral
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = :id_user  `,
            {
              replacements: { id_user },
              type: QueryTypes.SELECT
            }
          );
          return { status: 206, data: queryIfNotTransaction };
        }
        return { status: 200, data: query };
      };
    };
    module2.exports = CarteiraRepository;
  }
});

// src/repositories/transacao-repository.js
var require_transacao_repository = __commonJS({
  "src/repositories/transacao-repository.js"(exports2, module2) {
    var { Sequelize, QueryTypes, where } = require("sequelize");
    var Transacao = require_transacao();
    var Banco = require_banco();
    var TransacaoRepository = class {
      static buscarExtratoGeral = async (id_user, limit) => {
        const query = await Banco.sequelize.query(
          `
                    SELECT 
    usuario.id_usuario,
    usuario.nome,
    usuario.cpf,
    conta_bancaria.saldo AS valor_disponivel,
    banco.name AS nome_instituicao_financeira,
    (SELECT 
            SUM(c.saldo)
        FROM
            conta_bancaria AS c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldo_total_geral
FROM
    conta_bancaria
        JOIN
    banco ON conta_bancaria.banco_id = banco.id_banco
        JOIN
    usuario ON conta_bancaria.usuario_id = usuario.id_usuario 
    WHERE usuario.id_usuario = :id_user
    ORDER BY conta_bancaria.saldo DESC 

    `,
          {
            replacements: { id_user, limit },
            type: QueryTypes.SELECT
          }
        );
        return { status: 200, data: query };
      };
      static buscarExtratoBancario = async (id_user, contaBancariaId) => {
        const query = await Banco.sequelize.query(
          `
  SELECT 
    usuario.nome,
    usuario.cpf,
    pix.key,
    banco_origem.name AS nome_instituicao_financeira_origem,
    banco_destino.name AS nome_instituicao_financeira_destino,
    conta_bancaria_destino.id_conta as idContaBancariaDestino,
    conta_bancaria_origem.id_conta as idContaBancariaOrigem,
    conta_bancaria_origem.saldo saldoContaBancariaOrigem,
    conta_bancaria_destino.saldo as saldoContaBancariaDestino,
    transacao.data_transacao,
    transacao.descricao,
    transacao.valor,
    (SELECT 
            SUM(c.saldo)
        FROM
            conta_bancaria c
        WHERE
            c.usuario_id = usuario.id_usuario) AS saldoTotalGeral,
    (SELECT 
            SUM(a.valor)
        FROM
            transacao AS a
                JOIN
            conta_bancos AS cb ON a.conta_flux_origem_id = cb.id_contaBancos
        WHERE
            cb.contaBancaria_id = :contaBancariaId AND a.valor < 0) AS saidas,
    (SELECT 
            SUM(a.valor)
        FROM
            transacao AS a
                JOIN
            conta_bancos AS cb ON a.conta_flux_origem_id = cb.id_contaBancos
        WHERE
            cb.contaBancaria_id = :contaBancariaId AND a.valor > 0) AS entradas
FROM
    transacao
        JOIN
    conta_bancos AS conta_origem ON transacao.conta_flux_origem_id = conta_origem.id_contaBancos
        JOIN
    pix ON conta_origem.pix_id = pix.id_pix
        JOIN
    usuario ON conta_origem.usuario_id = usuario.id_usuario
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
    AND 
        conta_origem.contaBancaria_id = :contaBancariaId

ORDER BY transacao.data_transacao DESC;

  
      `,
          {
            replacements: { id_user, contaBancariaId },
            type: QueryTypes.SELECT
          }
        );
        return { status: 200, data: query };
      };
    };
    module2.exports = TransacaoRepository;
  }
});

// src/services/transacao-service.js
var require_transacao_service = __commonJS({
  "src/services/transacao-service.js"(exports2, module2) {
    var homeRepository = require_home_repository();
    var cateiraRepository = require_carteira_repository();
    var transacaoRepository = require_transacao_repository();
    var Transacao = require_transacao();
    var usuarioRepository = require_usuario_repository();
    var TransacaoService = class {
      static listarDadosHome = async (id_user, usuario_nome_token) => {
        const query = await homeRepository.getHomeData(id_user, 10);
        const username = usuario_nome_token;
        if (!query || query.data == null || query.data.length === 0) {
          return {
            status: 206,
            data: username,
            message: "Voc\xEA ainda n\xE3o possui transa\xE7\xF5es feitas"
          };
        }
        return { status: 200, data: query.data, nome: username };
      };
      static listarHistoricoTransacao = async (id_user) => {
        var query = await cateiraRepository.get(id_user, 10);
        console.log(query);
        if (!query || query.data.length === 0) {
          return {
            status: query.status,
            message: query.data
          };
        }
        const resultPorcentAndQuery = query.data.map((transacao) => {
          let total = parseFloat(transacao.saldoTotalGeral).toFixed(2);
          let valor = parseFloat(transacao.valor).toFixed(2);
          let tipo_operacao = transacao.tipo_operacao;
          if (tipo_operacao == "deposito") {
            let aumentoPorcent = valor / total * 100;
            console.log(`Aumento Percentual: ${aumentoPorcent.toFixed(2)}%`);
            return {
              ...transacao,
              porcentagem: `${aumentoPorcent.toFixed(2)}%`
            };
          } else if (tipo_operacao == "transferencia") {
            console.log(tipo_operacao);
            let diminuicaoPorcent = valor / total * 100;
            console.log(diminuicaoPorcent);
            console.log(
              `Diminui\xE7\xE3o Percentual: ${diminuicaoPorcent.toFixed(2)}%`
            );
            return {
              ...transacao,
              porcentagem: `${diminuicaoPorcent.toFixed(2)}%`
            };
          }
          return;
        }).filter((transacoes) => transacoes !== null);
        const campoSaltoTotalGeral = query.data.map(
          (transacao) => transacao.saldoTotalGeral
        );
        const totalGeral = campoSaltoTotalGeral.length > 0 ? campoSaltoTotalGeral[0] : null;
        return { status: 200, data: { totalGeral, resultPorcentAndQuery } };
      };
      static listarExtratoGeral = async (id_user) => {
        const query = await transacaoRepository.buscarExtratoGeral(id_user);
        if (!query || query.data.length === 0) {
          return {
            status: 204,
            message: "Voc\xEA ainda n\xE3o realizou transa\xE7\xF5es"
          };
        }
        return { data: query.data, status: 200 };
      };
      static buscarExtratoContaBancaria = async (id_user, contaBancariaId) => {
        const query = await transacaoRepository.buscarExtratoBancario(
          id_user,
          contaBancariaId
        );
        if (!query || query.data.length === 0) {
          return {
            status: 204,
            message: "Voc\xEA ainda n\xE3o realizou transa\xE7\xF5es"
          };
        }
        return { data: query.data, status: 200 };
      };
    };
    module2.exports = TransacaoService;
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

// src/controllers/carteira-controller.js
var transacaoService = require_transacao_service();
var authService = require_auth_service();
var CarteiraController = class {
  static renderCarteira = async (req, res) => {
    try {
      const token = req.body.token || req.query.token || req.headers["x-access-token"];
      const data = await authService.decodeToken(token);
      const usuario_id_token = data.id;
      const response = await transacaoService.listarHistoricoTransacao(usuario_id_token);
      if (response.status === 200) {
        return res.status(response.status).json(response.data);
      } else {
        console.log(response.status);
        console.log(response.status);
        console.log(response.status);
        return res.status(response.status).json({ message: response.data });
      }
    } catch (error) {
      throw error;
    }
  };
};
module.exports = CarteiraController;
