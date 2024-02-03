'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductReview.belongsTo(models.Product, { foreignKey: 'idProduct', as: 'review' })
    }
  }
  ProductReview.init({
    idProduct: DataTypes.STRING,
    idUser: DataTypes.STRING,
    idBill: DataTypes.STRING,
    comment: DataTypes.STRING,
    star: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    idParent: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ProductReview',
  });
  return ProductReview;
};