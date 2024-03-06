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
    return queryInterface.bulkInsert("UserDetails", [
      {
        id: 1,
        user_id: 1,
        first_name: "Usaid",
        last_name: "Aka",
        gender: "Male",
        phone: "089652433296",
        email_contact: "usaidaka@gmail.com",
        phone_contact: "0981239123",
        mbti: "ISTJ",
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        user_id: 2,
        first_name: "Fahmi",
        last_name: "Efendy",
        gender: "Male",
        phone: "089652433206",
        email_contact: "fahmiefendy@gmail.com",
        phone_contact: "0981239111",
        mbti: "ISTJ",
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 3,
        user_id: 3,
        first_name: "Leondy",
        last_name: "Feliks",
        gender: "Male",
        phone: "089652433216",
        email_contact: "leondyfeliks@gmail.com",
        phone_contact: "0981239113",
        mbti: "ISTJ",
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 1,
        user_id: 1,
        first_name: "admin",
        last_name: "one",
        gender: "Male",
        phone: "089652433276",
        email_contact: "admin@gmail.com",
        phone_contact: "09812559123",
        mbti: "ISTJ",
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
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
     */ return queryInterface.bulkDelete("UserDetails", null, {});
  },
};
