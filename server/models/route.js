"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Route.belongsTo(models.City, {
        foreignKey: "current_city_id",
        as: "current_city",
      });
      Route.belongsTo(models.Province, {
        foreignKey: "current_province_id",
        as: "current_province",
      });
      Route.belongsTo(models.City, {
        foreignKey: "direction_city_id",
        as: "direction_city",
      });
      Route.belongsTo(models.Province, {
        foreignKey: "direction_province_id",
        as: "direction_province",
      });
      Route.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Route.init(
    {
      user_id: DataTypes.INTEGER,
      current_province_id: DataTypes.INTEGER,
      current_city_id: DataTypes.INTEGER,
      direction_province_id: DataTypes.INTEGER,
      direction_city_id: DataTypes.INTEGER,
      current_detail: DataTypes.STRING,
      current_longitude: DataTypes.STRING,
      current_latitude: DataTypes.STRING,
      direction_detail: DataTypes.STRING,
      direction_longitude: DataTypes.STRING,
      direction_latitude: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Route",
      paranoid: true,
    }
  );
  return Route;
};
