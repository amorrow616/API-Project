'use strict';

const { Op } = require('sequelize');
const { Booking } = require('../models');

const bookings = [
  {
    spotId: 1,
    userId: 2,
    startDate: "2024-06-19",
    endDate: "2024-06-23"
  },
  {
    spotId: 2,
    userId: 3,
    startDate: "2024-07-04",
    endDate: "2024-07-11"
  },
  {
    spotId: 3,
    userId: 4,
    startDate: "2024-08-11",
    endDate: "2024-08-12"
  },
  {
    spotId: 4,
    userId: 1,
    startDate: "2024-09-21",
    endDate: "2024-10-23"
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
