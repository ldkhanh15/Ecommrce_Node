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
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING
            },
            returnAddress: {
                type: Sequelize.STRING,
            },
            pickupAddress: {
                type: Sequelize.STRING
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