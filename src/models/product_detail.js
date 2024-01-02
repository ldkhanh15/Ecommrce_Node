'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductDetail.belongsTo(models.Trademark, { foreignKey: 'idBrand', as: 'brand' })


      ProductDetail.belongsTo(models.CateSub, { foreignKey: 'idCate', as: 'cate' })
      ProductDetail.belongsTo(models.Product, { foreignKey: 'idProduct', as: 'product' })
    }
  }
  ProductDetail.init({
    idProduct: DataTypes.STRING,
    idBrand: DataTypes.STRING,
    idCate: DataTypes.STRING,
    like: DataTypes.INTEGER,
    description: DataTypes.STRING,
    weight: DataTypes.FLOAT,
    store: DataTypes.STRING,
    from: DataTypes.STRING,
    origin: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    quantitySale: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ProductDetail',
  });
  return ProductDetail;
};