'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.hasMany(models.Bill,{foreignKey:'idPayment',as:'bill'})
      Payment.belongsToMany(models.User, {
        through: 'UserPayment',
        foreignKey: 'idPayment',
        otherKey: 'idUser',
        as: 'user', // Tên của association
      });
      Payment.belongsToMany(models.Voucher, {
        through: 'VoucherPayment',
        foreignKey: 'idPayment',
        otherKey: 'idVoucher',
        as: 'voucher', // Tên của association
      });
    }
  }
 Payment.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'Payment',
  });
  return Payment;
};