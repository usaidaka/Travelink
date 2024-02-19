"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Order, { foreignKey: "product_id" });
      Product.hasMany(models.Cart, { foreignKey: "product_id" });
      Product.hasOne(models.Route, { foreignKey: "route_id" });
      Product.hasMany(models.ImageProduct, { foreignKey: "product_id" });
      Product.belongsToMany(models.Product, {
        through: "ProductPivot",
        foreignKey: "product_id",
        as: "Product",
      });
    }
  }
  Product.init(
    {
      route_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      description: DataTypes.TEXT,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Product",
      paranoid: true,
    }
  );
  return Product;
};
