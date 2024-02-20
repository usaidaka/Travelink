"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address.belongsTo(models.User, { foreignKey: "user_id" });
      Address.belongsTo(models.Province, { foreignKey: "province_id" });
      Address.belongsTo(models.City, { foreignKey: "city_id" });
    }
  }
  Address.init(
    {
      user_id: DataTypes.INTEGER,
      province_id: DataTypes.INTEGER,
      city_id: DataTypes.INTEGER,
      detail: DataTypes.STRING,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      title: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Address",
      paranoid: true,
    }
  );
  return Address;
};
