'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductSale.belongsTo(models.Product, { foreignKey: 'idProduct', as: 'product' })
    }
  }
  ProductSale.init({
    idProduct: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    sold: DataTypes.INTEGER,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'ProductSale',
  });
  return ProductSale;
};