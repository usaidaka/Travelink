"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupPivot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupPivot.belongsTo(models.User, {
        through: "User",
        foreignKey: "user_id",
        as: "users",
      });
      GroupPivot.belongsTo(models.Group, {
        through: "Group",
        foreignKey: "group_id",
        as: "groups",
      });
    }
  }
  GroupPivot.init(
    {
      user_id: DataTypes.INTEGER,
      group_id: DataTypes.INTEGER,
      is_leader: DataTypes.BOOLEAN,
      is_allow: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "GroupPivot",
      paranoid: true,
    }
  );
  return GroupPivot;
};
