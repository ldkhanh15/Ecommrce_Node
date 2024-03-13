'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Shop, { foreignKey: 'idUser', as: 'shop' })
      User.hasMany(models.AddressUser, { foreignKey: 'idUser', as: 'address' })
      User.hasMany(models.Blog, { foreignKey: 'idAuthor', as: 'blog' })
      User.hasMany(models.BlogComment, { foreignKey: 'idAuthor', as: 'blogComment' })
      User.hasMany(models.ProductReview, { foreignKey: 'idUser', 'as': 'productReview' })
      User.hasMany(models.Bill, { foreignKey: 'idBuyer', 'as': 'bill' })

      User.belongsToMany(models.Product, {
        through: 'UserProduct',
        foreignKey: 'idUser',
        otherKey: 'idProduct',
        as: 'product', // Tên của association
      })
      User.belongsToMany(models.Payment, {
        through: 'UserPayment',
        foreignKey: 'idUser',
        otherKey: 'idPayment',
        as: 'payment', // Tên của association
      })
      User.belongsToMany(models.Voucher, {
        through: 'UserVoucher',
        foreignKey: 'idUser',
        otherKey: 'idVoucher',
        as: 'voucher', // Tên của association
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    birthday: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    fileName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};