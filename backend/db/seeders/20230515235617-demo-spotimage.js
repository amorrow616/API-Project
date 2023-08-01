'use strict';

const { Op } = require('sequelize');
const { SpotImage } = require('../models');

const spotImages = [
  {
    spotId: 1,
    url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyamin-mellish-186077.jpg&fm=jpg',
    preview: true
  },
  {
    spotId: 2,
    url: 'https://hips.hearstapps.com/hmg-prod/images/dunagan-diverio-design-group-1487169401.jpg',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/ef/4e/56/schrute-farms.jpg?w=700&h=-1&s=1',
    preview: false
  },
  {
    spotId: 4,
    url: 'https://cdn.homedsgn.com/wp-content/uploads/2017/11/Waterfront-Home-Coogee-by-MPR-Design-Group-Infint-pool.jpg',
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
