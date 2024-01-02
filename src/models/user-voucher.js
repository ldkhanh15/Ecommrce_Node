'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserVoucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
 UserVoucher.init({
    idUser: DataTypes.STRING,
    idVoucher: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'UserVoucher',
  });
  return UserVoucher;
};