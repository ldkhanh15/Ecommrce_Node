'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BlogComment.belongsTo(models.Blog,{foreignKey:'idBlog',as :'blog_comment'})
    }
  }
 BlogComment.init({
    idBlog: DataTypes.STRING,
    idParent: DataTypes.STRING,
    comment: DataTypes.STRING,
    star: DataTypes.INTEGER,
    idAuthor: DataTypes.STRING,
  }, {
    sequelize,
    modelName:  'BlogComment',
  });
  return BlogComment;
};