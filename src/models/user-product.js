'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
 UserProduct.init({
    idUser: DataTypes.STRING,
    idProduct: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'UserProduct',
  });
  return UserProduct;
};