'use strict';

const bcrypt = require("bcryptjs");
const { User } = require('../models');
const { Op } = require('sequelize');

const users = [
  {
    email: 'demo@demos.com',
    username: 'TestUser1',
    hashedPassword: bcrypt.hashSync('password'),
    firstName: 'Bill',
    lastName: 'Nye'
  },
  {
    email: 'demo2@demos.com',
    username: 'TestUser2',
    hashedPassword: bcrypt.hashSync('password2'),
    firstName: 'Dwight',
    lastName: 'Shrute'
  },
  {
    email: 'demo3@demos.com',
    username: 'TestUser3',
    hashedPassword: bcrypt.hashSync('password3'),
    firstName: 'Bigwig',
    lastName: 'Rabbit'
  },
  {
    email: 'demo4@demos.com',
    username: 'TestUser4',
    hashedPassword: bcrypt.hashSync('password4'),
    firstName: 'Larry',
    lastName: 'TheDog'
  }
];

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return User.bulkCreate(users, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['TestUser1', 'TestUser2', 'TestUser3', 'TestUser4']
      }
    }, {});
  }
};
