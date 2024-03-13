'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasOne(models.ProductDetail, { foreignKey: 'idProduct', as: 'detailProduct' }),

      Product.hasMany(models.Combo, { foreignKey: 'idProduct', as: 'combo' }),
      Product.hasMany(models.ProductImage, { foreignKey: 'idProduct', as: 'image' }),
      Product.hasMany(models.ProductReview, { foreignKey: 'idProduct', as: 'review' }),
      Product.hasMany(models.Color, { foreignKey: 'idProduct', as: 'color' }),
      Product.hasMany(models.ProductSale, { foreignKey: 'idProduct', as: 'productSale' }),
      
      Product.belongsTo(models.Cate, { foreignKey: 'idCate', as: 'cate' }),
      Product.belongsTo(models.Shop, { foreignKey: 'idShop', as: 'shop' }),
      
      Product.belongsToMany(models.Size, {
        through: 'ProductSize',
        foreignKey: 'idProduct',
        otherKey: 'idSize',
        as: 'size', // Tên của association
      });
      Product.belongsToMany(models.User, {
        through: 'UserProduct',
        foreignKey: 'idProduct',
        otherKey: 'idUser',
        as: 'user', // Tên của association
      });
      Product.belongsToMany(models.Cart, {
        through: 'CartProduct',
        foreignKey: 'idProduct',
        otherKey: 'idCart',
        as: 'cart', // Tên của association
      });
      Product.belongsToMany(models.Bill, {
        through: 'BillProduct',
        foreignKey: 'idProduct',
        otherKey: 'idBill',
        as: 'bill', // Tên của association
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    mainImage: DataTypes.STRING,
    hoverImage: DataTypes.STRING,
    sale: DataTypes.FLOAT,
    idShop: DataTypes.STRING,
    sold: DataTypes.INTEGER,
    idCate: DataTypes.STRING,
    introduce:DataTypes.STRING,
    brand:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};