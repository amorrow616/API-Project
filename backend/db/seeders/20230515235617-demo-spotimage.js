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
