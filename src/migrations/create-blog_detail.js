'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BlogDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idBlog: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
        //author
      },
      content:{
        type: Sequelize.TEXT
      },
      contentHTML:{
        type: Sequelize.TEXT
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
        'BlogDetails',
        'contentHTML',
        Sequelize.TEXT
      )
    ]
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BlogDetails');
  }
};