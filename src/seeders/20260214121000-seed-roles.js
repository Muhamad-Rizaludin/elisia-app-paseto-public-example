"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", [
      {
        id: "b497eec3-62ff-4683-bf55-88c2586d2511",
        name: "admin",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: "40dbab62-0eed-4fe4-830f-0f369e11c2f2",
        name: "user",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", {
      id: ["b497eec3-62ff-4683-bf55-88c2586d2511", "40dbab62-0eed-4fe4-830f-0f369e11c2f2"]
    });
  }
};
