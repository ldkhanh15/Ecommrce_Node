'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Bills', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            totalPrice: {
                type: Sequelize.STRING
            },
            idShop: {
                type: Sequelize.STRING,
            },
            idBuyer: {
                type: Sequelize.STRING
            },
            idStatus: {
                type: Sequelize.STRING,
            },
            idAddress: {
                type: Sequelize.STRING
            },
            idDeliver: {
                type: Sequelize.STRING,
            },
            idPayment: {
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
        await queryInterface.dropTable('Bills');
    }
};