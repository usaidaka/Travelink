"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Credential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Credential.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Credential.init(
    {
      user_id: DataTypes.INTEGER,
      otp: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Credential",
      paranoid: true,
    }
  );
  return Credential;
};
