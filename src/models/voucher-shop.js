'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherShop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
 VoucherShop.init({
    idShop: DataTypes.STRING,
    idVoucher: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'VoucherShop',
  });
  return VoucherShop;
};