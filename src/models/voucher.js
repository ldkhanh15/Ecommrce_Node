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
      Voucher.belongsToMany(models.User, {
        through: 'UserVoucher',
        foreignKey: 'idVoucher',
        otherKey: 'idUser',
        as: 'user', // Tên của association
      })
      Voucher.belongsToMany(models.Shop, {
        through: 'VoucherShop',
        foreignKey: 'idVoucher',
        otherKey: 'idShop',
        as: 'shop', // Tên của association
      })
      Voucher.belongsToMany(models.Deliver, {
        through: 'VoucherDeliver',
        foreignKey: 'idVoucher',
        otherKey: 'idDeliver',
        as: 'deliver', // Tên của association
      })
      Voucher.belongsToMany(models.Payment, {
        through: 'VoucherPayment',
        foreignKey: 'idVoucher',
        otherKey: 'idPayment',
        as: 'payment', // Tên của association
      })
    }
  }
  Voucher.init({
    maVoucher: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    remain: DataTypes.INTEGER,
    limit: DataTypes.STRING,
    description: DataTypes.STRING,
    salePT: DataTypes.INTEGER,
    salePrice: DataTypes.INTEGER,
    minBill: DataTypes.INTEGER,
    type: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};