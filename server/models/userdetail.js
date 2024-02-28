"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserDetail.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  UserDetail.init(
    {
      user_id: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone: { type: DataTypes.STRING, unique: true },
      email_contact: DataTypes.STRING,
      phone_contact: DataTypes.STRING,
      gender: DataTypes.ENUM("Male", "Female"),
      mbti: DataTypes.ENUM(
        "ISTJ",
        "ISFJ",
        "INFJ",
        "INTJ",
        "ISTP",
        "ISFP",
        "INFP",
        "INTP",
        "ESTP",
        "ESFP",
        "ENFP",
        "ENTP",
        "ESTJ",
        "ESFJ",
        "ENFJ",
        "ENTJ"
      ),
      is_verify: DataTypes.BOOLEAN,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserDetail",
      paranoid: true,
    }
  );
  return UserDetail;
};
