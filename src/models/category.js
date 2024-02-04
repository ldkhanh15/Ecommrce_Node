'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cate.hasMany(models.Product, { foreignKey: 'idCate', as: 'product' })
    }
  }
  Cate.init({
    image: DataTypes.STRING,
    fileName: DataTypes.STRING,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Cate',
  });
  return Cate;
};