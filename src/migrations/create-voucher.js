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
      idPayment: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.STRING
      },
      endDate: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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