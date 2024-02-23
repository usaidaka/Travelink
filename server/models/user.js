"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Follow, { foreignKey: "follow_by" });
      User.hasOne(models.Follow, { foreignKey: "follow_to" });
      User.hasOne(models.UserDetail, { foreignKey: "user_id" });
      User.hasMany(models.Address, { foreignKey: "user_id" });
      User.hasOne(models.Credential, { foreignKey: "user_id" });
      User.hasMany(models.Post, { foreignKey: "user_id" });
      User.hasOne(models.Route, { foreignKey: "user_id" });
      User.hasMany(models.Comment, { foreignKey: "user_id" });
      User.belongsToMany(models.Group, {
        through: "GroupPivot",
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      image: DataTypes.TEXT,
      role: DataTypes.ENUM("Super", "Admin", "User"),
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
    }
  );
  return User;
};
