"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Province.hasMany(models.Address, { foreignKey: "province_id" });
      Province.hasMany(models.Post, { foreignKey: "province_id" });
      Province.hasMany(models.Route, { foreignKey: "current_province_id" });
      Province.hasMany(models.Route, { foreignKey: "direction_province_id" });
      Province.hasMany(models.Destination, { foreignKey: "province_id" });
      Province.hasMany(models.City, { foreignKey: "province_id" });
    }
  }
  Province.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Province",
    }
  );
  return Province;
};
