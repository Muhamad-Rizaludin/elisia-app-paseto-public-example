"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("users", [
      {
        id: "4fd17d52-3f58-4993-b3cc-e7f1558e13de",
        role_id: "b497eec3-62ff-4683-bf55-88c2586d2511",
        name: "System Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("Admin123!", 10),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: ["admin@example.com"]
    });
  }
};
