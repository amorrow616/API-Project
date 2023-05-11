'use strict';

const bcrypt = require("bcryptjs");
const { Op } = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, [
      {
        email: 'demo@demos.com',
        username: 'TestUser1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'demo2@demos.com',
        username: 'TestUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'demo3@demos.com',
        username: 'TestUser3',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['TestUser1', 'TestUser2', 'TestUser3']
      }
    }, {});
  }
};
