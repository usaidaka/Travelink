"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Routes", {
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
      current_province_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Provinces",
          key: "id",
        },
        allowNull: false,
      },
      current_city_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Cities",
          key: "id",
        },
        allowNull: false,
      },
      direction_province_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Provinces",
          key: "id",
        },
        allowNull: false,
      },
      direction_city_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Cities",
          key: "id",
        },
        allowNull: false,
      },
      current_detail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      current_longitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      current_latitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direction_detail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direction_longitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direction_latitude: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("Routes");
  },
};
