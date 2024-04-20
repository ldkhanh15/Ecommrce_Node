'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voucher.belongsTo(models.Shop, { foreignKey: 'idShop', as: 'shop' })

    }
  }
  Voucher.init({
    maVoucher: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    remain: DataTypes.INTEGER,
    description: DataTypes.STRING,
    salePT: DataTypes.INTEGER,
    salePrice: DataTypes.INTEGER,
    idShop: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};