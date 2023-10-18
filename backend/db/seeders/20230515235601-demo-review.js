'use strict';

const { Op } = require('sequelize');
const { Review } = require('../models');

const reviews = [
  {
    "spotId": 1,
    "userId": 3,
    "review": "Host tried to force me to complete a puzzle. Otherwise a nice stay.",
    "stars": 4.4
  },
  {
    "spotId": 1,
    "userId": 2,
    "review": "Not too bad, there was a plethora of oreos to eat and even a cheese plate.",
    "stars": 3.8
  },
  {
    "spotId": 1,
    "userId": 4,
    "review": "Great location, but the Wi-Fi was spotty. Would stay again though.",
    "stars": 4.1
  },
  {
    "spotId": 1,
    "userId": 5,
    "review": "Lovely place! The garden was beautiful, and the host was very friendly.",
    "stars": 4.7
  },
  {
    "spotId": 1,
    "userId": 6,
    "review": "Clean and cozy. The host provided excellent local recommendations.",
    "stars": 4.6
  },
  {
    "spotId": 2,
    "userId": 4,
    "review": "Not sure what I was expecting but it was not this. Confused? Send help.",
    "stars": 1.2
  },
  {
    "spotId": 2,
    "userId": 6,
    "review": "Decent stay. The view was nice, but the bathroom plumbing was a bit faulty.",
    "stars": 3.3
  },
  {
    "spotId": 2,
    "userId": 5,
    "review": "Average experience. Expected more for the price.",
    "stars": 2.5
  },
  {
    "spotId": 2,
    "userId": 1,
    "review": "Great for a short stay. Convenient location and friendly staff.",
    "stars": 4.0
  },
  {
    "spotId": 2,
    "userId": 3,
    "review": "Excellent service! The host went above and beyond to make our stay comfortable.",
    "stars": 4.8
  },
  {
    "spotId": 3,
    "userId": 5,
    "review": "The co-host is a bit weird, he ran beside the car as we drove up. Generous portions of bacon.",
    "stars": 3.7
  },
  {
    "spotId": 3,
    "userId": 6,
    "review": "Beautiful interior, but the noise from the nearby construction site was bothersome.",
    "stars": 3.2
  },
  {
    "spotId": 3,
    "userId": 4,
    "review": "Cozy atmosphere. Enjoyed my stay despite minor inconveniences.",
    "stars": 4.1
  },
  {
    "spotId": 3,
    "userId": 2,
    "review": "Not bad, not great. Adequate for the price.",
    "stars": 2.9
  },
  {
    "spotId": 3,
    "userId": 1,
    "review": "Pleasant stay. Clean rooms and friendly staff.",
    "stars": 4.3
  },
  {
    "spotId": 4,
    "userId": 6,
    "review": "What a relaxing stay! The French concierge even took care of our kids so we could go out.",
    "stars": 4.9
  },
  {
    "spotId": 4,
    "userId": 1,
    "review": "Exceptional service. Will definitely return for another stay.",
    "stars": 5.0
  },
  {
    "spotId": 4,
    "userId": 3,
    "review": "Charming atmosphere and courteous staff. Enjoyed every moment of our stay.",
    "stars": 4.7
  },
  {
    "spotId": 4,
    "userId": 5,
    "review": "A bit pricey, but the experience was worth it. Beautiful rooms and excellent amenities.",
    "stars": 4.5
  },
  {
    "spotId": 4,
    "userId": 2,
    "review": "Good service, but the breakfast options were limited.",
    "stars": 3.8
  },
  {
    "spotId": 5,
    "userId": 3,
    "review": "JJ's Diner exceeded our expectations! The menu variety was great, and the staff was incredibly friendly.",
    "stars": 4.6
  },
  {
    "spotId": 5,
    "userId": 6,
    "review": "Went for brunch, stayed for dessert! JJ's Diner is a must-visit for food enthusiasts.",
    "stars": 4.8
  },
  {
    "spotId": 5,
    "userId": 4,
    "review": "A cozy atmosphere and delicious food. The waffles were a delight, and the coffee was superb.",
    "stars": 4.7
  },
  {
    "spotId": 6,
    "userId": 1,
    "review": "Carter's Cabin was a perfect retreat. The cabin was well-maintained, and the surroundings were serene.",
    "stars": 4.9
  },
  {
    "spotId": 6,
    "userId": 5,
    "review": "Exceptional hospitality! The hosts were welcoming, and the cabin had all the amenities we needed.",
    "stars": 5.0
  },
  {
    "spotId": 6,
    "userId": 2,
    "review": "A peaceful getaway spot. Carter's Cabin provided the solitude we were looking for.",
    "stars": 4.7
  },
  {
    "spotId": 7,
    "userId": 6,
    "review": "Pawnee Retreat was spacious and comfortable. Great for family gatherings with ample entertainment options.",
    "stars": 4.5
  },
  {
    "spotId": 7,
    "userId": 3,
    "review": "Fantastic property with lovely outdoor spaces. The rooms were clean, and the kitchen was well-equipped.",
    "stars": 4.6
  },
  {
    "spotId": 7,
    "userId": 2,
    "review": "Ideal venue for events. Pawnee Retreat's layout and facilities made our family reunion memorable.",
    "stars": 4.8
  },
  {
    "spotId": 8,
    "userId": 4,
    "review": "Community Lodge had a cozy ambiance. Themed rooms were a hit, and the communal areas were inviting.",
    "stars": 2.8
  },
  {
    "spotId": 8,
    "userId": 5,
    "review": "A unique experience! Community Lodge's creative themes added a touch of excitement to our stay.",
    "stars": 4.1
  },
  {
    "spotId": 8,
    "userId": 6,
    "review": "Friendly staff and comfortable rooms. Community Lodge is a great choice for a relaxing weekend getaway.",
    "stars": 3.2
  },
  {
    "spotId": 9,
    "userId": 1,
    "review": "Gilmore Guesthouse captured the essence of the show. Cozy rooms and a coffee shop straight out of Stars Hollow.",
    "stars": 4.7
  },
  {
    "spotId": 9,
    "userId": 5,
    "review": "A charming stay! Gilmore Guesthouse's attention to detail made us feel like we were part of the Gilmore world.",
    "stars": 4.9
  },
  {
    "spotId": 9,
    "userId": 6,
    "review": "Perfect for fans of Gilmore Girls. The guesthouse had a warm atmosphere and friendly staff.",
    "stars": 4.1
  },
  {
    "spotId": 10,
    "userId": 4,
    "review": "Redwood Retreat was a nature lover's dream. Comfortable accommodation surrounded by majestic redwoods.",
    "stars": 4.8
  },
  {
    "spotId": 10,
    "userId": 2,
    "review": "Serene and secluded. Redwood Retreat provided the peace and quiet we were seeking.",
    "stars": 4.9
  },
  {
    "spotId": 10,
    "userId": 1,
    "review": "An enchanting getaway spot. The cabin was well-appointed, and the natural surroundings were breathtaking.",
    "stars": 5.0
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
