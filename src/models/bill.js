'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bill.hasMany(models.BillProduct, { foreignKey: 'idBill', as: 'quantityProduct' });

      Bill.belongsTo(models.Deliver, { foreignKey: 'idDeliver', as: 'deliver' })
      Bill.belongsTo(models.AddressUser, { foreignKey: 'idAddress', as: 'address' })
      Bill.belongsTo(models.StatusBill, { foreignKey: 'idStatus', as: 'status' })
      Bill.belongsTo(models.Payment, { foreignKey: 'idPayment', as: 'payment' })
      Bill.belongsTo(models.Shop, { foreignKey: 'idShop', as: 'shop' })
      Bill.belongsTo(models.User,{foreignKey: 'idBuyer', as: 'user' })
      Bill.belongsToMany(models.Product, {
        through: 'BillProduct',
        foreignKey: 'idBill',
        otherKey: 'idProduct',
        as: 'product', // Tên của association
      })
    }
  }
  Bill.init({
    idShop: DataTypes.STRING,
    idBuyer: DataTypes.STRING,
    idStatus: DataTypes.STRING,
    idAddress: DataTypes.STRING,
    idDeliver: DataTypes.STRING,
    idPayment: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Bill',
  });
  return Bill;
};