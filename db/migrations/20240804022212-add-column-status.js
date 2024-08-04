'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('Pix','status',{
    
      type: Sequelize.ENUM('VALIDANDO','PENDENTE','REGISTRADA','ERRO'),
      allowNull: false
    
   })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Pix');
  }
};
