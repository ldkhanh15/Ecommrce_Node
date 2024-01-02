'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idProduct: {
        type: Sequelize.STRING
      },
      idBrand: {
        type: Sequelize.STRING
      },
      idCate: {
        type: Sequelize.STRING
      },
      like: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      description: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      store: {
        type: Sequelize.STRING
      },
      from: {
        type: Sequelize.STRING
      },
      origin: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      quantitySale: {
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductDetails');
  }
};