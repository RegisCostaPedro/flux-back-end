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
    var Usuario = require_usuario();
    var ContaBancaria2 = require_conta_bancaria();
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

// src/repositories/carteira-repository.js
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
module.exports = CarteiraRepository;
