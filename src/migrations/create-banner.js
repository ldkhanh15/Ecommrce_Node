'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Banners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      start: {
        type: Sequelize.DATE
      },
      end: {
        type: Sequelize.DATE
      },
      title:{
        type: Sequelize.STRING
      },
      subTitle:{
        type: Sequelize.STRING
      },
      image:{
        type: Sequelize.STRING
      },
      fileName:{
        type: Sequelize.STRING
      },
      main:{
        type:Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Banners');
  }
};