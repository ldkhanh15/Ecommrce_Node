'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CateSub extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CateSub.belongsTo(models.CateParent, { foreignKey: 'idCateParent', as: 'parent' })
      CateSub.hasMany(models.ProductDetail, { foreignKey: 'idCate', as: 'product' })
    }
  }
  CateSub.init({
    idCateParent: DataTypes.STRING,
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CateSub',
  });
  return CateSub;
};