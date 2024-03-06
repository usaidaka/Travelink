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
     */ return queryInterface.bulkInsert("Destinations", [
      {
        id: 2,
        province_id: 25,
        city_id: 449,
        description: "Lorem ipsum",
        image: null,
        phone: "123123123123",
        detail: "lorem ipsum",
        longitude: "98.90230814279798",
        latitude: "2.6108377000000003",
        createdAt: "2024-02-29 00:51:41",
        updatedAt: "2024-02-29 11:00:26",
        deletedAt: null,
      },
      {
        id: 3,
        province_id: 1,
        city_id: 1,
        description: "lorem ipsum",
        image: null,
        phone: "01239812",
        detail: "lorem ipsum",
        longitude: "106.37843076052444",
        latitude: "-2.4309211649558473",
        createdAt: "2024-02-29 01:01:47",
        updatedAt: "2024-02-29 01:01:47",
        deletedAt: null,
      },
      {
        id: 4,
        province_id: 1,
        city_id: 1,
        description: "lorem ipsum",
        image: null,
        phone: "123123123123",
        detail: "lorem ipsum",
        longitude: "95.3225751",
        latitude: "5.8927453",
        createdAt: "2024-02-29 14:29:15",
        updatedAt: "2024-02-29 14:29:36",
        deletedAt: null,
      },
      {
        id: 5,
        province_id: 1,
        city_id: 17,
        description: "Lorem Ipusm asim dolor met",
        image: null,
        phone: "089123971212",
        detail: "lorem ipsum",
        longitude: "106.37843076052444",
        latitude: "-2.4309211649558473",
        createdAt: "2024-03-03 01:54:31",
        updatedAt: "2024-03-03 01:54:31",
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
    return queryInterface.bulkDelete("Destinations", null, {});
  },
};
