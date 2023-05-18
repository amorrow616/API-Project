'use strict';

const { Op } = require('sequelize');
const { ReviewImage } = require('../models');

const reviewImages = [
  {
    reviewId: 1,
    url: 'fakereview.com'
  },
  {
    reviewId: 2,
    url: 'facereview2.com'
  },
  {
    reviewId: 3,
    url: 'fakereview3.com'
  },
  {
    reviewId: 4,
    url: 'fakereview4.com'
  }
];

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return ReviewImage.bulkCreate(reviewImages, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {
      reviewId: {
        [Op.in]: [1, 2, 3, 4]
      }
    }, {});
  }
};
