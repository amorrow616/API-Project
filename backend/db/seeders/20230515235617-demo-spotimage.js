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
    spotId: 1,
    url: 'https://media.istockphoto.com/id/1263083361/photo/modern-home-with-intricate-detail-throughout.jpg?s=612x612&w=0&k=20&c=Ax4uHREjcKprK5sHPPURkhR-fz4Wct5m-zUoCnOYhiY=',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://media.istockphoto.com/id/1297586166/photo/modern-elegant-kitchen-stock-photo.jpg?s=612x612&w=0&k=20&c=4qVGJq3EZ-DrVC08kFIXuZMGRe5NcEvziV-H4L9aFKc=',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://media.istockphoto.com/id/1264323513/photo/scandinavian-bedroom-interior-stock-photo.jpg?s=612x612&w=0&k=20&c=jYMbmLtLDOezPThalkXCfrKjbgkYHpQX2oY3-vjPhVI=',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://media.istockphoto.com/id/1291917591/photo/modern-bathroom-interior-stock-photo.jpg?s=612x612&w=0&k=20&c=pxqczxYLHDIm0zskG3QgktaO0ICwAd3H4x5b8vdIRuY=',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://hips.hearstapps.com/hmg-prod/images/dunagan-diverio-design-group-1487169401.jpg',
    preview: true
  },
  {
    spotId: 2,
    url: 'https://images.trvl-media.com/lodging/34000000/33400000/33394600/33394569/30c3fce0.jpg?impolicy=resizecrop&rw=500&ra=fit',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://www.mmdgcc.com/img/containers/assets/8WSHP.jpg/3614d04280518c7fadc855ad39d210d1.jpg',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://cdn.decorpad.com/photos/2012/11/13/e1752d2bb856.jpg',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://i.pinimg.com/originals/a9/47/a1/a947a1c7f4044ef63e0d1ccb1f4604e2.jpg',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/ef/4e/56/schrute-farms.jpg?w=700&h=-1&s=1',
    preview: true
  },
  {
    spotId: 3,
    url: 'https://extremepolebuildings.b-cdn.net/wp-content/uploads/Blogs/2022-02/finished-pole-barn-ideas-768x512.jpeg',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://cdn.homeguide.com/assets/images/content/homeguide-pole-barn-home-interior-t.jpg',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://media.istockphoto.com/id/1412912622/photo/frame-mockup-in-rustic-villa-bathroom-interior-background.jpg?s=612x612&w=0&k=20&c=sMjOa6AvWtMuvKo8xjUuXwGMmbErGX2Lp_PVe5mRsvQ=',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://www.mydomaine.com/thmb/rdg5skGlcmmt3Xs2V9WTFUjXPqA=/1474x0/filters:no_upscale():strip_icc()/barn-door-ideas-4-julian-porcino-off-the-wall-28094078f71c4156b76f73a9d69c3cc0.png',
    preview: false
  },
  {
    spotId: 4,
    url: 'https://cdn.homedsgn.com/wp-content/uploads/2017/11/Waterfront-Home-Coogee-by-MPR-Design-Group-Infint-pool.jpg',
    preview: true
  },
  {
    spotId: 4,
    url: 'https://st.hzcdn.com/simgs/pictures/kitchens/accurate-builders-oyster-bay-remodel-roger-turk-northlight-photography-img~fa619e340c2ced0b_14-1973-1-8a4cd2f.jpg',
    preview: false
  },
  {
    spotId: 4,
    url: 'https://hips.hearstapps.com/hmg-prod/images/ramsa-gambrel-1487169206.jpg?resize=480:*',
    preview: false
  },
  {
    spotId: 4,
    url: 'https://www.homestratosphere.com/wp-content/uploads/2017/02/Bathroom-25.jpg.webp',
    preview: false
  },
  {
    spotId: 4,
    url: 'https://media.istockphoto.com/id/1263778913/photo/beautiful-basement-entertaining-room-with-led-lighting-in-tray-ceiling.jpg?s=612x612&w=0&k=20&c=iiv2mX5f1WKQspSIr9hxyORZ79MuWwyLDzwdCNWigdw=',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://media.istockphoto.com/id/136702098/photo/diner-sign-in-red-neon-roadside-restaurant-retro-1950s.jpg?s=612x612&w=0&k=20&c=dVoUCbpdP-IMti0SNAdGhMKVvNvs4ThYazEk3N4Zpf8=',
    preview: true
  },
  {
    spotId: 5,
    url: 'https://media.istockphoto.com/id/482307142/photo/diner-restaurant.jpg?s=612x612&w=0&k=20&c=iU-Cz9RvUSA6tguGICbUQoc1F9WZAIB2j2pd7wpEcBY=',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://media.istockphoto.com/id/475449558/photo/diner-restaurant.jpg?s=612x612&w=0&k=20&c=8boEdNtqIS3_LI2JRmJkb6hNvK0WpRgMcjXfBL6MFro=',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://media.istockphoto.com/id/471386891/photo/ancient-majorcan-bedroom.jpg?s=612x612&w=0&k=20&c=Pz373xnkoW7MCcQJo-F68guAzdIMAelUOGQPhehKVZI=',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://media.istockphoto.com/id/1346997224/photo/take-a-bath.jpg?s=612x612&w=0&k=20&c=16HOM2QYkQAjRdG8z1ft7dRkYqhrNmP4GpXXG3sHBA0=',
    preview: false
  },
  {
    spotId: 6,
    url: 'https://media.istockphoto.com/id/108219206/photo/log-cabin-hidden-in-the-trees-by-the-lake-ohara-in-canada.jpg?s=612x612&w=0&k=20&c=3rt_fpgh6Be9f2M4GLoGDSteHA4BuEIV9fTiShPJWoM=',
    preview: true
  },
  {
    spotId: 6,
    url: 'https://media.istockphoto.com/id/1349844002/photo/cozy-lake-house-living-room-with-lake-view.jpg?s=612x612&w=0&k=20&c=rkKFGwLgIdyi1j-l7MQ0zAtB5bvLBPjpDowUg4-1dXs=',
    preview: false
  },
  {
    spotId: 6,
    url: 'https://media.istockphoto.com/id/1269896875/photo/cozy-bedroom-inside-winter-cottage-in-3d-render.jpg?s=612x612&w=0&k=20&c=Dhva-LKdpdh6JJ7fb26G1LRzUG170dGztV11o1xRwEw=',
    preview: false
  },
  {
    spotId: 6,
    url: 'https://media.istockphoto.com/id/1270113359/photo/3d-render-of-a-luxurious-interior-of-a-winter-cottage.jpg?s=612x612&w=0&k=20&c=TkBs_-zWRSqPTX_rnvhXIljapFY98KIotxYoGdinEkk=',
    preview: false
  },
  {
    spotId: 6,
    url: 'https://media.istockphoto.com/id/157424066/photo/inviting-hot-tub.jpg?s=612x612&w=0&k=20&c=_YB5-PwSKXevpyuK_fIpeUAIZQeU-ZkmOcuvI3bTPlc=',
    preview: false
  },
  {
    spotId: 7,
    url: 'https://media.istockphoto.com/id/682432560/photo/stunning-luxury-home-exterior-at-sunset.jpg?s=612x612&w=0&k=20&c=NApF0vAI8wppLkNX73wWRxXUO2nyLHCB6peu38k2rtI=',
    preview: true
  },
  {
    spotId: 7,
    url: 'https://media.istockphoto.com/id/1156432390/photo/luxurious-interior-design-of-the-hall-in-a-big-house.jpg?s=612x612&w=0&k=20&c=V0lo1-NdtsuwUU5rynD57RDJqgTjYkbKQooOOExdl24=',
    preview: false
  },
  {
    spotId: 7,
    url: 'https://media.istockphoto.com/id/950127464/photo/stunning-kitchen-and-dining-room-in-new-luxury-home-wood-beams-and-elegant-pendant-lights.jpg?s=612x612&w=0&k=20&c=1463LToNVu1M-zOHx5Jiu2ZGnnhntA7sZS3EQTp-khE=',
    preview: false
  },
  {
    spotId: 7,
    url: 'https://media.istockphoto.com/id/840452084/photo/spacious-villa-with-cement-wall.jpg?s=612x612&w=0&k=20&c=MqShvppVFL6EfVzybgeOEQxnGQagqyMjhP5ttGwnMO4=',
    preview: false
  },
  {
    spotId: 7,
    url: 'https://media.istockphoto.com/id/962109046/photo/spa-with-whirlpool-and-sauna.jpg?s=612x612&w=0&k=20&c=MeurRFz0Q-8qtTzTfTYPs82KCs0Yb6gk-zSjODM0I8o=',
    preview: false
  },
  {
    spotId: 8,
    url: 'https://media.istockphoto.com/id/153728492/photo/snowbound-cottage.jpg?s=612x612&w=0&k=20&c=lF8TAILIdt-5JXBCWXfvDE8YsLvxi9G5or9quXJIl8Q=',
    preview: true
  },
  {
    spotId: 8,
    url: 'https://media.istockphoto.com/id/928898220/photo/astrology-themed-bedroom-for-kid.jpg?s=612x612&w=0&k=20&c=XxbtbtYFaCn7NxQzwec01lU5SufVvAzuU4AbNT2NZto=',
    preview: false
  },
  {
    spotId: 8,
    url: 'https://media.istockphoto.com/id/1058783226/photo/blue-themed-holiday-villa-interior.jpg?s=612x612&w=0&k=20&c=inKh9Rb5jZXEXMyIPLpfP92YIboaTZNxHjAGoxmM3yg=',
    preview: false
  },
  {
    spotId: 8,
    url: 'https://media.istockphoto.com/id/989979178/photo/nautical-themed-bathroom-with-a-blue-bath-tub-3d-render.jpg?s=612x612&w=0&k=20&c=0ryobN3AH1ZKvrPiCm42LYlw2m_sQc4hnm3tQ7uHBRk=',
    preview: false
  },
  {
    spotId: 8,
    url: 'https://media.istockphoto.com/id/1276730617/photo/nautical-themed-bedroom-with-striped-duvet-on-bed.jpg?s=612x612&w=0&k=20&c=Z6SDDk4YlMT2xALFFVqTx81G9mKERY-P-WWIkpYBFnI=',
    preview: false
  },
  {
    spotId: 9,
    url: 'https://media.istockphoto.com/id/1428594094/photo/empty-coffee-shop-interior-with-wooden-tables-coffee-maker-pastries-and-pendant-lights.jpg?s=612x612&w=0&k=20&c=dMqeYCJDs3BeBP_jv93qHRISDt-54895SPoVc6_oJt4=',
    preview: true
  },
  {
    spotId: 9,
    url: 'https://media.istockphoto.com/id/1036068800/photo/eco-cotton-linen-and-blanket-on-a-bed-in-nature-loving-family-guesthouse-for-spring-and.jpg?s=612x612&w=0&k=20&c=5gYu66MEXxYz6vnbWimFvaEX-tGZ6lZEJJHjiRElIOU=',
    preview: false
  },
  {
    spotId: 9,
    url: 'https://media.istockphoto.com/id/1345839942/photo/ebenalp-switzerland-famous-mountain-guesthouse-aescher-in-the-middle-of-the-hiking-trail.jpg?s=612x612&w=0&k=20&c=NkjO07aD1NGVtrxibnmTtk8feu1BbK69rqUONHJ0wxA=',
    preview: false
  },
  {
    spotId: 9,
    url: 'https://media.istockphoto.com/id/1271997900/photo/new-clean-staging-model-home-house-hotel-hostel-or-apartment-guesthouse-shower-bath-bathroom.jpg?s=612x612&w=0&k=20&c=INodZlrVBmDCDVKhUBapK7FUOBwAJqly3jjbCfBsk1Y=',
    preview: false
  },
  {
    spotId: 9,
    url: 'https://media.istockphoto.com/id/144726431/photo/classic-interior.jpg?s=612x612&w=0&k=20&c=ZIzZQK3i7CZqZRpWJI9Sr1aNcwFmUU34wy-tQw0zHcs=',
    preview: false
  },
  {
    spotId: 10,
    url: 'https://media.istockphoto.com/id/1466527697/photo/view-of-an-abandoned-cabin-in-the-woods.jpg?s=612x612&w=0&k=20&c=gSfKqEPKtRX58gWIBzZfv34Nm2c0qpHMZy8EI2fi1p0=',
    preview: true
  },
  {
    spotId: 10,
    url: 'https://media.istockphoto.com/id/1293507877/photo/rotorua-redwoods.jpg?s=612x612&w=0&k=20&c=hRNcDIivxuqWEkfK8-rqrGe0sFPZhoQUBCAZDOv3MU8=',
    preview: false
  },
  {
    spotId: 10,
    url: 'https://media.istockphoto.com/id/1162039993/photo/beautiful-asian-woman-nude-in-onsen.jpg?s=612x612&w=0&k=20&c=G0lqoF79ioTwiu9LTJkb5ife7aZRr9Qvxfk4HLY_3xc=',
    preview: false
  },
  {
    spotId: 10,
    url: 'https://media.istockphoto.com/id/507832837/photo/chandelier-and-armchair-in-rustic-bedroom.jpg?s=612x612&w=0&k=20&c=eB614nzW0sezhdQ2eeGJGBaajFmI93Pw1ykp5T689vc=',
    preview: false
  },
  {
    spotId: 10,
    url: 'https://media.istockphoto.com/id/183373666/photo/modern-and-white-washroom-with-bathtub-and-two-mirrors.jpg?s=612x612&w=0&k=20&c=wIDbxs1Zian_z9MiXETSMwe9I2s23v3xLdxZLuUanSs=',
    preview: false
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
