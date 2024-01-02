'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatusBill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StatusBill.hasMany(models.Bill, { foreignKey: 'idStatus', as: 'bill' })
    }
  }
  StatusBill.init({
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'StatusBill',
  });
  return StatusBill;
};