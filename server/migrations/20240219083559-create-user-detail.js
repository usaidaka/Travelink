"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("Male", "Female"),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email_contact: {
        type: Sequelize.STRING,
      },
      phone_contact: {
        type: Sequelize.STRING,
      },
      mbti: {
        type: Sequelize.ENUM(
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
      },
      is_verify: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserDetails");
  },
};
