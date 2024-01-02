'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CateParent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CateParent.hasMany(models.CateSub, { foreignKey: 'idCateParent', as: 'child' })
    }
  }
  CateParent.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CateParent',
  });
  return CateParent;
};