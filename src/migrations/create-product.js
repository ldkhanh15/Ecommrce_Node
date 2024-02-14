'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.FLOAT,
                defaultValue: 0
            },
            mainImage: {
                type: Sequelize.STRING
            },
            hoverImage: {
                type: Sequelize.STRING
            },
            avgStar: {
                type: Sequelize.FLOAT,
                defaultValue: 0.0
            },
            sale: {
                type: Sequelize.FLOAT,
                defaultValue: 0
            },
            idShop: {
                type: Sequelize.STRING,
            },
            sold: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            idCate: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            introduce: {
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
        await queryInterface.dropTable('Products');
    }
};