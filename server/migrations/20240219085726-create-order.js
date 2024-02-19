"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
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
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
        allowNull: false,
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Addresses",
          key: "id",
        },
        allowNull: false,
      },
      order_status: {
        type: Sequelize.ENUM(
          "Pending Payment",
          "Awaiting Payment Confirmation",
          "Complete",
          "In Process",
          "Cancelled",
          "Shipped",
          "Rejected"
        ),
      },
      image: {
        type: Sequelize.TEXT,
      },
      total_price: {
        type: Sequelize.DECIMAL,
      },
      delivery_price: {
        type: Sequelize.DECIMAL,
      },
      delivery_time: {
        type: Sequelize.DATE,
      },
      delivery_courier: {
        type: Sequelize.STRING,
      },
      receipt: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Orders");
  },
};
