"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ImagePost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImagePost.belongsTo(models.Post, {
        foreignKey: { name: "post_id", allowNull: true },
        onDelete: "CASCADE",
      });
    }
  }
  ImagePost.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Post",
          key: "id",
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ImagePost",
      paranoid: true,
    }
  );
  return ImagePost;
};
