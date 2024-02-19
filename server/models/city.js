"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      City.belongsTo(models.Province, { foreignKey: "province_id" });
      City.hasMany(models.Address, { foreignKey: "city_id" });
      City.hasMany(models.Post, { foreignKey: "city_id" });
      City.hasMany(models.Route, { foreignKey: "current_city_id" });
      City.hasMany(models.Route, { foreignKey: "direction_city_id" });
      City.hasMany(models.Destination, { foreignKey: "city_id" });
    }
  }
  City.init(
    {
      province_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      postal_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "City",
    }
  );
  return City;
};
