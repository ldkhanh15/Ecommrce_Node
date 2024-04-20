'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idShop:{
        type: Sequelize.INTEGER
      },
      maVoucher: {
        type: Sequelize.STRING
      },
      start: {
        type: Sequelize.DATE
      },
      end: {
        type: Sequelize.DATE
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      remain:{
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      description: {
        type: Sequelize.STRING
      },
      salePT: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      salePrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.removeColumn('Vouchers', 'limit', { transaction: t }),
      ])
  })
  
   
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vouchers');
   
  }
};