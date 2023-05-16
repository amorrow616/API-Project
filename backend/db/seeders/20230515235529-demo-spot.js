'use strict';

const { Op } = require('sequelize');
const { Spot } = require('../models');

const spots = [
  {
    address: '206 Sister Street',
    city: 'Syracuse',
    state: 'New York',
    country: 'United States',
    lat: 25.0131,
    lng: 86.2447,
    name: "Little Sister's House",
    description: 'Come stay at a place where you will feel like family! Cozy quarters and an abundance of snacks.',
    price: 50
  },
  {
    address: '555 Dunder Way',
    city: 'Scranton',
    state: 'Pennsylvania',
    country: 'United States',
    lat: 33.4854,
    lng: 21.1795,
    name: 'Dunder Mifflin',
    description: 'Owner is determined, worker, intense, good worker, hard worker, terrific. He even has a gym and daycare in the building.',
    price: 600
  },
  {
    address: '1 Shrute Ave',
    city: 'Scranton',
    state: 'Pennsylvania',
    country: 'United States',
    lat: 44.2874,
    lng: 77.9658,
    name: 'Shrute Farms BnB',
    description: 'Check out our reviews on Trip Advisor! Homemade matresses. We cater to the elderly. ....permits are pending.',
    price: 175
  },
  {
    address: '214 Oak Tree Lane',
    city: 'Stars Hollow',
    state: 'Connecticut',
    country: 'United States',
    lat: 12.1745,
    lng: 88.4423,
    name: 'The Dragonfly Inn',
    description: 'Quaint bed and breakfast. Excellent chef. Charming town.',
    price: 230
  }
];

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';

    return Spot.bulkCreate(spots, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ["Little Sister's House", 'Dunder Mifflin', 'Shrute Farms BnB', 'The Dragonfly Inn']
      }
    }, {});
    // return queryInterface.bulkDelete(options, {
    //   where: { address: spots.map(spot => spot.address) }
    // }, {});
  }
};
