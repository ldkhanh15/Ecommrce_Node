'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserPayment.belongsTo(models.User,{foreignKey:'idUser',as:'paymentInfo'})
    }
  }
 UserPayment.init({
    idUser: DataTypes.STRING,
    idPayment: DataTypes.STRING,
    info: DataTypes.STRING,
    
    
  }, {
    sequelize,
    modelName:  'UserPayment',
  });
  return UserPayment;
};