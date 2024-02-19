"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductPivot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductPivot.belongsTo(models.User, {
        through: "User",
        foreignKey: "user_id",
        as: "User",
      });
      ProductPivot.belongsTo(models.Product, {
        through: "Product",
        foreignKey: "product_id",
        as: "Product",
      });
    }
  }
  ProductPivot.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ProductPivot",
      paranoid: true,
    }
  );
  return ProductPivot;
};
