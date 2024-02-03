'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BlogDetail.belongsTo(models.Blog,{foreignKey:'idBlog',as :'blog_comment'})
    }
  }
 BlogDetail.init({
    idBlog: DataTypes.STRING,
    comment: DataTypes.STRING,
    content: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'BlogDetail',
  });
  return BlogDetail;
};