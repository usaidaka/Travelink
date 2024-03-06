"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Routes", [
      {
        id: 1,
        user_id: 2,
        current_province_id: 6,
        current_city_id: 496,
        direction_province_id: 34,
        direction_city_id: 229,
        current_detail: "test",
        current_longitude: "106.8525121",
        current_latitude: "-6.2265517",
        direction_detail: "test",
        direction_longitude: "98.90230814279798",
        direction_latitude: "2.6108377000000003",
        createdAt: "2024-02-23 16:32:14",
        updatedAt: "2024-02-23 16:33:23",
        deletedAt: null,
      },
      {
        id: 2,
        user_id: 1,
        current_province_id: 17,
        current_city_id: 172,
        direction_province_id: 15,
        direction_city_id: 89,
        current_detail: "hgj",
        current_longitude: "106.8525121",
        current_latitude: "-6.2265517",
        direction_detail: "iuyi",
        direction_longitude: "120.2839798",
        direction_latitude: "-8.7693197",
        createdAt: "2024-02-24 21:24:25",
        updatedAt: "2024-02-26 13:54:22",
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Routes", null, {});
  },
};
