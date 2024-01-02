'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
 VoucherPayment.init({
    idVoucher: DataTypes.STRING,
    idPayment: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'VoucherPayment',
  });
  return VoucherPayment;
};