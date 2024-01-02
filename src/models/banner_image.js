'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BannerImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BannerImage.belongsTo(models.Banner,{foreignKey:'idBanner',as:'banner'})
    }
  }
  BannerImage.init({
    idBanner:DataTypes.STRING,
    description:DataTypes.STRING,
    link:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BannerImage',
  });
  return BannerImage;
};