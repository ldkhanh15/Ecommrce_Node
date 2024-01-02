'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsToMany(models.Product, {
        through: 'CartProduct',
        foreignKey: 'idCart',
        otherKey: 'idProduct',
        as: 'product', // Tên của association
      })
    }
  }
 Cart.init({
    idUser: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'Cart',
  });
  return Cart;
};