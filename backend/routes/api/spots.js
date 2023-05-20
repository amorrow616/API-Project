const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Spot, SpotImage, Review, Booking, User, ReviewImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();

const spotExists = async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
    next();
};

const addAggregateData = async (req, res, next) => {
    const Spots = await Spot.findAll({
        raw: true
    });
    for (let spot of Spots) {
        const reviewAvg = await Review.findOne({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']],
            where: {
                spotId: spot.id
            },
            raw: true
        });
        if (reviewAvg) {
            spot.avgRating = reviewAvg.avgRating;
        } else {
            spot.avgRating = 'No ratings yet.'
        }
    }

    for (let spot of Spots) {
        const spotImg = await SpotImage.findOne({
            where: {
                spotId: spot.id
            }
        });
        if (spotImg) {
            spot.previewImage = spotImg.url
        } else {
            spot.previewImage = 'No images provided.'
        }
    }
    req.Spots = Spots;
    next();
};

const authorizationReq = async (req, res, next) => {
    const { user } = req;

    if (Spot.ownerId !== user.id) {
        res.status(403).json({
            message: "Spot must belong to you in order to manipulate it."
        });
    }
    next();
};

router.get('/', addAggregateData, async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, minPrice, maxPrice } = req.query;

    page = page === undefined ? 1 : page;
    size = size === undefined ? 20 : size;

    req.Spots.page = page;
    req.Spots.size = size;

    res.status(200).json({
        Spots: req.Spots,
        page,
        size
    });
});

router.get('/current', [requireAuth, addAggregateData], async (req, res, next) => {
    const { user } = req;

    const ownerSpots = req.Spots.filter(spot => spot.ownerId === user.id);

    res.status(200).json({ Spots: ownerSpots });
});

router.get('/:spotId', [spotExists, addAggregateData], async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
        where: {
            id: spotId
        },
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                alias: 'Owner'
            }
        ]
    });

    const countReviews = await spot.getReviews({
        attributes: [[Sequelize.fn('SUM', Sequelize.col('review')), 'numReviews'], [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating']],
        where: {
            spotId: spot.id
        },
        raw: true
    });

    spot.numReviews = countReviews[0].numReviews;
    spot.avgStarRating = countReviews[0].avgStarRating;
    res.status(200).json(spot);
});

router.get('/:spotId/reviews', spotExists, async (req, res, next) => {
    const spotId = req.params.spotId;

    const spotReview = await Review.findAll({
        where: {
            spotId: spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    res.status(200).json({
        Reviews: spotReview
    });
});

router.get('/:spotId/bookings', [requireAuth, spotExists], async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;

    if (spot.ownerId === user.id) {
        const spotBookings = await Booking.findOne({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });
        res.status(200).json({
            Bookings: spotBookings
        });
    } else {
        const spotBookings = await Booking.findOne({
            where: {
                spotId: spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        });
        res.status(200).json({
            Bookings: spotBookings
        });
    }
});

const checkProvidedData = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Price per day is required'),
    check('startDate')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('startDate is required'),
    check('endDate')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('endDate cannot come before startDate'),
    handleValidationErrors
];

router.post('/', requireAuth, checkProvidedData, async (req, res, next) => {
    const { ownerId, address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });
    return res.status(201).json(spot);
});

router.put('/:spotId', [requireAuth, spotExists, authorizationReq], checkProvidedData, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    spot.set({
        address: address || spot.address,
        city: city || spot.city,
        state: state || spot.state,
        country: country || spot.country,
        lat: lat || spot.lat,
        lng: lng || spot.lng,
        name: name || spot.name,
        description: description || spot.description,
        price: price || spot.price,
    });
    await spot.save();
    res.status(200).json(spot);
});

router.post('/:spotId/images', [requireAuth, authorizationReq, spotExists], async (req, res, next) => {
    const { url, preview } = req.body;
    const spotId = req.params.spotId;

    const wantedSpot = await SpotImage.findOne({
        where: {
            spotId: spotId
        }
    })
    const spotImage = wantedSpot.set({
        url,
        preview
    });
    await spotImage.save();
    res.status(200).json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    });
});

router.post('/:spotId/reviews', [requireAuth, spotExists, authorizationReq], async (req, res, next) => {
    const { review, stars } = req.body;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    const addReview = await spot.set({
        review,
        stars
    });
    await addReview.save();
    return res.status(201).json(spot);
});

router.post('/:spotId/bookings', [requireAuth, spotExists], async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;
    const booking = await Booking.findOne({
        where: {
            spotId: spotId
        }
    })

    if (spot.ownerId !== user.id) {
        if (startDate < endDate) {
            const createBooking = await booking.set({
                startDate,
                endDate
            });
            await booking.save();
            return res.status(200).json(createBooking);
        } else {
            res.status(400).json({
                message: "Bad Request",
                errors: "endDate cannot be on or before startDate"
            })
        }
    } else {
        res.status(403).json({
            message: 'You cannot book your own spot silly!'
        })
    }
})

router.delete('/:spotId', [requireAuth, spotExists, authorizationReq], async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    await spot.destroy();
    res.status(200).json({
        message: 'Successfully deleted'
    })
});


module.exports = router;
