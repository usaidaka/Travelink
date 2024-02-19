"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "user_id" });
      Order.belongsTo(models.Product, { foreignKey: "product_id" });
      Order.belongsTo(models.Address, { foreignKey: "address_id" });
    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      address_id: DataTypes.INTEGER,
      order_status: DataTypes.ENUM(
        "Pending Payment",
        "Awaiting Payment Confirmation",
        "Complete",
        "In Process",
        "Cancelled",
        "Shipped",
        "Rejected"
      ),
      image: DataTypes.TEXT,
      total_price: DataTypes.DECIMAL,
      delivery_price: DataTypes.DECIMAL,
      delivery_time: DataTypes.DATE,
      delivery_courier: DataTypes.STRING,
      receipt: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Order",
      paranoid: true,
    }
  );
  return Order;
};
