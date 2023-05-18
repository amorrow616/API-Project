'use strict';

const { Op } = require('sequelize');
const { SpotImage } = require('../models');

const spotImages = [
  {
    spotId: 1,
    url: 'google.com',
    preview: true
  },
  {
    spotId: 2,
    url: 'testurl.com',
    preview: false
  },
  {
    spotId: 3,
    url: 'anothertesturl.com',
    preview: false
  },
  {
    spotId: 4,
    url: 'images.com',
    preview: true
  }
];

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return SpotImage.bulkCreate(spotImages, {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {
      url: {
        [Op.in]: ['google.com', 'testurl.com', 'anothertesturl.com', 'images.com']
      }
    }, {});
  }
};
