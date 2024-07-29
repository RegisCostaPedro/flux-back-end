'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pix', {
      id_pix: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      chave_pix: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id_usuario',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      },
      banco_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Banco',
          key: 'id_banco'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    }, {
      Sequelize,
      modelName: 'Pix',
      tableName: 'pix'
    });



  },

  async down(queryInterface) {
    await queryInterface.dropTable('Pix');

  }
};
