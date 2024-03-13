'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AddressUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AddressUser.belongsTo(models.User, { foreignKey: 'idUser', as: 'user' })
      AddressUser.hasMany(models.Bill, { foreignKey: 'idAddress', as: 'bill' })
    }
  }
  AddressUser.init({
    idUser: DataTypes.STRING,
    address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'AddressUser',
  });
  return AddressUser;
};