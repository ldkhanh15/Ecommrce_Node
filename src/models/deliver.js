'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deliver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Deliver.hasMany(models.Bill, { foreignKey: 'idDeliver', as: 'bill' })

      Deliver.belongsToMany(models.Shop, {
        through: 'ShopDeliver',
        foreignKey: 'idDeliver',
        otherKey: 'idShop',
        as: 'shop'
      })
    }
  }
  Deliver.init({
    name: DataTypes.STRING,
    price: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Deliver',
  });
  return Deliver;
};