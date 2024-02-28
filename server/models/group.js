"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        through: "GroupPivot",
        foreignKey: "group_id",
        as: "users",
      });

      Group.belongsTo(models.Route, {
        foreignKey: "route_id",
      });
    }
  }
  Group.init(
    {
      user_id: DataTypes.INTEGER,
      route_id: DataTypes.INTEGER,
      group_name: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Group",
      paranoid: true,
    }
  );
  return Group;
};
