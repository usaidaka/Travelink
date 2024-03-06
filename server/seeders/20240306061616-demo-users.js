"use strict";

const bcrypt = require("bcryptjs");

const makePassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(pass, salt);
  return hashed;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const defaultPassword = await makePassword(process.env.DEFAULT_PASSWORD);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("User", [
      {
        id: 1,
        username: "UsaidAka",
        password: defaultPassword,
        email: "ujedkemal@gmail.com",
        image:
          "http://res.cloudinary.com/dgdxx2chz/image/upload/v1709534405/image/sdaje7ehlymwiwsbcc1p.jpg",
        role: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        username: "FahmyEfendi",
        password: defaultPassword,
        email: "fahmi@gmail.com",
        image:
          "https://img.freepik.com/free-photo/close-up-smiley-man-taking-selfie_23-2149155156.jpg",
        role: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 3,
        username: "LeondyFeliks",
        password: defaultPassword,
        email: "leondyfeliks@gmail.com",
        image:
          "https://img.freepik.com/free-photo/smiling-woman-shirt-making-selfie-studio_171337-17196.jpg",
        role: "User",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 4,
        username: "admin",
        password: defaultPassword,
        email: "admin@gmail.com",
        image:
          "https://img.freepik.com/free-photo/smiling-woman-shirt-making-selfie-studio_171337-17196.jpg",
        role: "Admin",
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
     */
    return queryInterface.bulkDelete("Users", null, {});
  },
};
