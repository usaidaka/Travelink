"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Post.hasMany(models.Comment, {
        foreignKey: { name: "post_id", allowNull: true },
        onDelete: "CASCADE",
      });
      Post.belongsTo(models.City, { foreignKey: "city_id" });
      Post.belongsTo(models.Province, { foreignKey: "province_id" });
      Post.belongsTo(models.User, { foreignKey: "user_id" });
      Post.hasMany(models.ImagePost, {
        foreignKey: { name: "post_id", allowNull: true },
        onDelete: "CASCADE",
      });
    }
  }
  Post.init(
    {
      user_id: DataTypes.INTEGER,
      province_id: DataTypes.INTEGER,
      city_id: DataTypes.INTEGER,
      caption: DataTypes.TEXT,
      location_name: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Post",
      paranoid: true,
    }
  );
  return Post;
};
