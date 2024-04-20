'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BillProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      idProduct: {
        type: Sequelize.STRING
      },
      idBill: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.FLOAT
      },
      type: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
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
    return [
      queryInterface.addColumn(
        'BillProducts',
        'discount',
        Sequelize.FLOAT
      )
    ]
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BillProducts');
  }
};