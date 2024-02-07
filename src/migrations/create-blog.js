'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idAuthor: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      view: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      image: {
        type: Sequelize.STRING,
      },
      fileName: {
        type: Sequelize.STRING
      },
      field: {
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
    await queryInterface.dropTable('Blogs');
  }
};