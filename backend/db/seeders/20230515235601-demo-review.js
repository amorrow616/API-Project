'use strict';

const { Op } = require('sequelize');
const { Review } = require('../models');

const reviews = [
  {
    spotId: 1,
    userId: 1,
    review: 'Host tried to force me to complete a puzzle. Otherwise a nice stay.',
    stars: 4.4
  },
  {
    spotId: 2,
    userId: 2,
    review: 'Not sure what I was expecting but it was not this. Confused? Send help.',
    stars: 1.2
  },
  {
    spotId: 3,
    userId: 3,
    review: 'The co-host is a bit weird, he ran beside the car as we drove up. Generous portions of bacon.',
    stars: 3.7
  },
  {
    spotId: 4,
    userId: 2,
    review: 'What a relaxing stay! The French concierge even took care of our kids so we could go out.',
    stars: 5.0
  }
];

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Review.bulkCreate(reviews, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
