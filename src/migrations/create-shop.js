'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Shops', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            idUser: {
                type: Sequelize.STRING
            },
            avatar: {
                type: Sequelize.STRING
            },
            fileName: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            username: {
                type: Sequelize.STRING,
            },
            name: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING
            },
            bank: {
                type: Sequelize.STRING,
            },
            introduce:{
                type: Sequelize.STRING
            },
            avgStar: {
                type: Sequelize.FLOAT,
            },
            comment:{
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('Shops');
    }
};