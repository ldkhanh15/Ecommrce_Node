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
      limit: {
        type: Sequelize.STRING
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
      minBill:{
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      type: {
        type: Sequelize.STRING
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vouchers');
  }
};