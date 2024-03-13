'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blog.hasMany(models.BlogComment, { foreignKey: 'idBlog', as: 'comment' })
      Blog.hasMany(models.Tag, { foreignKey: 'idBlog', as: 'tag' })
      Blog.hasOne(models.BlogDetail, { foreignKey: 'idBlog', as: 'detail' })

      Blog.belongsTo(models.User, { foreignKey: 'idAuthor', as: 'author' })
    }
  }
  Blog.init({
    idAuthor: DataTypes.STRING,
    name: DataTypes.STRING,
    view: DataTypes.INTEGER,
    image: DataTypes.STRING,
    field: DataTypes.STRING,
    fileName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};