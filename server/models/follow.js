"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follow.belongsTo(models.User, {
        foreignKey: "follow_by",
        as: "followBy",
      });

      Follow.belongsTo(models.User, {
        foreignKey: "follow_to",
        as: "followTo",
      });
    }
  }
  Follow.init(
    {
      follow_by: DataTypes.INTEGER,
      follow_to: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Follow",
      paranoid: true,
    }
  );
  return Follow;
};
