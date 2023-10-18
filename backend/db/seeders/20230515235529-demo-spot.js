'use strict';

const { Op } = require('sequelize');
const { Spot } = require('../models');

const spots = [
  {
    "ownerId": 1,
    "address": "206 Sister Street",
    "city": "Syracuse",
    "state": "New York",
    "country": "United States",
    "lat": 25.0131,
    "lng": 86.2447,
    "name": "Little Sister's House",
    "description": "Come stay at a place where you will feel like family! Cozy quarters and an abundance of snacks.",
    "price": 50
  },
  {
    "ownerId": 2,
    "address": "555 Dunder Way",
    "city": "Scranton",
    "state": "Pennsylvania",
    "country": "United States",
    "lat": 33.4854,
    "lng": 21.1795,
    "name": "Dunder Mifflin",
    "description": "Owner is determined, worker, intense, good worker, hard worker, terrific. He even has a gym and daycare in the building.",
    "price": 600
  },
  {
    "ownerId": 3,
    "address": "1 Shrute Ave",
    "city": "Scranton",
    "state": "Pennsylvania",
    "country": "United States",
    "lat": 44.2874,
    "lng": 77.9658,
    "name": "Shrute Farms BnB",
    "description": "Check out our reviews on Trip Advisor! Homemade mattresses. We cater to the elderly. ....permits are pending.",
    "price": 175
  },
  {
    "ownerId": 4,
    "address": "214 Oak Tree Lane",
    "city": "Stars Hollow",
    "state": "Connecticut",
    "country": "United States",
    "lat": 12.1745,
    "lng": 88.4423,
    "name": "The Dragonfly Inn",
    "description": "Quaint bed and breakfast. Excellent chef. Charming town.",
    "price": 230
  },
  {
    "ownerId": 5,
    "address": "123 Maple Avenue",
    "city": "Pawnee",
    "state": "Indiana",
    "country": "United States",
    "lat": 40.0379,
    "lng": 86.0426,
    "name": "JJ's Diner",
    "description": "Famous diner featured in local magazines and TV shows. Best waffles in town! Lodging is above the diner.",
    "price": 80
  },
  {
    "ownerId": 6,
    "address": "456 Pine Street",
    "city": "Eureka",
    "state": "California",
    "country": "United States",
    "lat": 40.8021,
    "lng": 124.1637,
    "name": "Carter's Cabin",
    "description": "Secluded cabin surrounded by nature. Ideal for a peaceful getaway.",
    "price": 120
  },
  {
    "ownerId": 1,
    "address": "789 Elm Lane",
    "city": "Pawnee",
    "state": "Indiana",
    "country": "United States",
    "lat": 40.0522,
    "lng": 86.2195,
    "name": "Pawnee Retreat",
    "description": "Spacious retreat house perfect for family gatherings and events.",
    "price": 300
  },
  {
    "ownerId": 2,
    "address": "234 Oak Avenue",
    "city": "Greendale",
    "state": "Colorado",
    "country": "United States",
    "lat": 39.6203,
    "lng": 105.3367,
    "name": "Community Lodge",
    "description": "Community-themed lodge with themed rooms and communal spaces.",
    "price": 180
  },
  {
    "ownerId": 3,
    "address": "567 Willow Lane",
    "city": "Stars Hollow",
    "state": "Connecticut",
    "country": "United States",
    "lat": 12.1201,
    "lng": 88.4502,
    "name": "Gilmore Guesthouse",
    "description": "Charming guesthouse with a coffee shop downstairs. Gilmore Girls fan paradise!",
    "price": 160
  },
  {
    "ownerId": 6,
    "address": "987 Cedar Street",
    "city": "Eureka",
    "state": "California",
    "country": "United States",
    "lat": 40.8103,
    "lng": 124.1557,
    "name": "Redwood Retreat",
    "description": "Cozy cottage nestled in the redwoods. Perfect for nature lovers.",
    "price": 110
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
      address: {
        [Op.in]: ['206 Sister Street', '555 Dunder Way', '1 Shrute Ave', '214 Oak Tree Lane']
      }
    }, {});
  }
};
