const { Sequelize } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banco', {
      id_banco: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      ispb: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      spi_participant_type: {
        type: Sequelize.ENUM('DIRETO', 'INDIRETO')
      }
    });

    await queryInterface.createTable('usuario', {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cpf: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      senha: {
        allowNull: false,
        type: Sequelize.STRING
      },
      roles: {
        allowNull: false,
        type: Sequelize.ENUM('usuario', 'admin')
      },
      verifyCode: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });

    await queryInterface.createTable('conta_bancaria', {
      id_conta: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuario',
          key: 'id_usuario'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      banco_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'banco',
          key: 'id_banco'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      saldo: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      tipo_conta: {
        allowNull: false,
        type: Sequelize.ENUM('CORRENTE', 'POUPANCA', 'SALARIO'),
        defaultValue: 'SALARIO'
      }
    });

    await queryInterface.createTable('pix', {
      id_pix: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      key: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      key_type: {
        allowNull: false,
        type: Sequelize.ENUM('EMAIL', 'CNPJ', 'TELEFONE', 'CHAVE_ALEATORIA')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('VALIDANDO', 'PENDENTE', 'REGISTRADA', 'ERRO')
      }
    });

    await queryInterface.createTable('conta_bancos', {
      id_contaBancos: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pix_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'pix',
          key: 'id_pix'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      contaBancaria_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'conta_bancaria',
          key: 'id_conta'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('ATIVO', 'INATIVO'),
        allowNull: false,
        defaultValue: 'ATIVO'
      }
    });

    await queryInterface.createTable('transacao', {
      id_transacao: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conta_flux_origem_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'conta_bancos',
          key: 'id_contaBancos'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      data_transacao: {
        allowNull: false,
        type: Sequelize.DATE
      },
      valor: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      tipo_operacao: {
        allowNull: false,
        type: Sequelize.ENUM('deposito', 'retirada', 'transferencia')
      },
      descricao: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      conta_bancos_destino_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transacao');
    await queryInterface.dropTable('conta_bancos');
    await queryInterface.dropTable('pix');
    await queryInterface.dropTable('conta_bancaria');
    await queryInterface.dropTable('usuario');
    await queryInterface.dropTable('banco');
  }
};
