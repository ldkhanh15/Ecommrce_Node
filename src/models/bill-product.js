'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BillProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BillProduct.belongsTo(models.Product, { foreignKey: 'idProduct', as: 'product' })
      BillProduct.belongsTo(models.Bill, { foreignKey: 'idBill', as: 'bill' })
    }
  }
  BillProduct.init({
    idBill: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BillProduct',
  });
  return BillProduct;
};