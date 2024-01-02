'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherDeliver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
 VoucherDeliver.init({
    idDeliver: DataTypes.STRING,
    idVoucher: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'VoucherDeliver',
  });
  return VoucherDeliver;
};