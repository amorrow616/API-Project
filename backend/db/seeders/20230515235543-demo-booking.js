'use strict';

const { Op } = require('sequelize');
const { Booking } = require('../models');

const bookings = [
  {
    spotId: 1,
    userId: 1
  },
  {
    spotId: 2,
    userId: 2
  },
  {
    spotId: 3,
    userId: 3
  },
  {
    spotId: 4,
    userId: 2
  }
];

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Booking.bulkCreate(bookings, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
