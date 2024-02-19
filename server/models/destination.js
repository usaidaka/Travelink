"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Destination.belongsTo(models.Province, { foreignKey: "province_id" });
      Destination.belongsTo(models.City, { foreignKey: "city_id" });
      Destination.hasMany(models.ImageDestination, {
        foreignKey: "destination_id",
      });
    }
  }
  Destination.init(
    {
      province_id: DataTypes.INTEGER,
      city_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      image: DataTypes.TEXT,
      phone: DataTypes.STRING,
      detail: DataTypes.STRING,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Destination",
      paranoid: true,
    }
  );
  return Destination;
};
