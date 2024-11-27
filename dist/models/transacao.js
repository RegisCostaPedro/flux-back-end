var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/database.js
var require_database = __commonJS({
  "src/config/database.js"(exports2, module2) {
    var { Sequelize: Sequelize2 } = require("sequelize");
    var conexao2 = new Sequelize2("flux_db", "root", "", {
      host: "localhost",
      dialect: "mysql",
      define: {
        timestamps: false,
        freezeTableName: true
      }
    });
    module2.exports = conexao2;
  }
});

// src/models/usuario.js
var require_usuario = __commonJS({
  "src/models/usuario.js"(exports2, module2) {
    var conexao2 = require_database();
    var { DataTypes: DataTypes2, Model: Model2 } = require("sequelize");
    var Usuario = class extends Model2 {
      static init(sequelize) {
        return super.init({
          id_usuario: {
            type: DataTypes2.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          nome: {
            type: DataTypes2.STRING,
            allowNull: false
          },
          cpf: {
            type: DataTypes2.STRING,
            allowNull: false,
            unique: true
          },
          email: {
            type: DataTypes2.STRING,
            allowNull: false,
            unique: true
          },
          senha: {
            type: DataTypes2.STRING,
            allowNull: false
          },
          roles: {
            type: DataTypes2.ENUM("usuario", "admin"),
            allowNull: false
          },
          verifyCode: {
            type: DataTypes2.INTEGER(6),
            allowNull: true
          },
          status: {
            type: DataTypes2.BOOLEAN,
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
    Usuario.init(conexao2);
    module2.exports = Usuario;
  }
});

// src/models/conta-bancaria.js
var require_conta_bancaria = __commonJS({
  "src/models/conta-bancaria.js"(exports2, module2) {
    var conexao2 = require_database();
    var { DataTypes: DataTypes2, Model: Model2 } = require("sequelize");
    var ContaBancaria = class extends Model2 {
      static init(sequelize) {
        return super.init({
          id_conta: {
            type: DataTypes2.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
          },
          usuario_id: {
            type: DataTypes2.INTEGER,
            allowNull: false,
            references: {
              model: "usuario",
              key: "id_usuario",
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
            }
          },
          banco_id: {
            type: DataTypes2.INTEGER,
            allowNull: false,
            references: {
              model: "banco",
              key: "id_banco",
              onDelete: "CASCADE",
              onUpdate: "CASCADE"
            }
          },
          saldo: {
            type: DataTypes2.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
          },
          tipo_conta: {
            type: DataTypes2.ENUM("CORRENTE", "POUPANCA", "SALARIO"),
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
    ContaBancaria.init(conexao2);
    module2.exports = ContaBancaria;
  }
});

// src/models/banco.js
var require_banco = __commonJS({
  "src/models/banco.js"(exports2, module2) {
    var conexao2 = require_database();
    var { DataTypes: DataTypes2, Model: Model2 } = require("sequelize");
    var Banco = class extends Model2 {
      static init(sequelize) {
        return super.init({
          id_banco: {
            autoIncrement: true,
            type: DataTypes2.INTEGER,
            allowNull: false,
            primaryKey: true
          },
          id: {
            type: DataTypes2.INTEGER
          },
          name: {
            type: DataTypes2.STRING
          },
          code: {
            type: DataTypes2.STRING
          },
          ispb: {
            type: DataTypes2.STRING
          },
          image: {
            type: DataTypes2.STRING
          },
          spi_participant_type: {
            type: DataTypes2.ENUM("DIRETO", "INDIRETO")
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
    var { DataTypes: DataTypes2, Model: Model2, Sequelize: Sequelize2 } = require("sequelize");
    var Usuario = require_usuario();
    var ContaBancaria = require_conta_bancaria();
    var Banco = require_banco();
    var ContaBancos2 = class extends Model2 {
      static init(sequelize) {
        return super.init(
          {
            id_contaBancos: {
              type: DataTypes2.INTEGER,
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
              type: DataTypes2.INTEGER,
              allowNull: true,
              references: {
                model: ContaBancaria,
                key: "id_conta",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
              }
            },
            status: {
              type: DataTypes2.ENUM("ATIVO", "INATIVO"),
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
module.exports = Transacao;
