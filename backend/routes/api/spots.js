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
        return res.status(404).json({
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

router.get('/', async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, minPrice, maxPrice } = req.query;
    let pagination = {};

    page = page === undefined ? 1 : page;
    size = size === undefined ? 20 : size;

    page = parseInt(page);
    size = parseInt(size);

    if (page < 1 || page > 10) {
        throw new Error('Page must be between 1 and 10')
    } else if (size < 1 || size > 20) {
        throw new Error('Size must be between 1 and 20')
    } else {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    const Spots = await Spot.findAll({
        raw: true,
        ...pagination
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


    res.status(200).json({
        Spots: Spots,
        page,
        size
    });
});

router.get('/current', [requireAuth, addAggregateData], async (req, res, next) => {
    const { user } = req;

    const ownerSpots = req.Spots.filter(spot => spot.ownerId === user.id);

    res.status(200).json({ Spots: ownerSpots });
});

router.get('/:spotId', spotExists, async (req, res, next) => {
    const spotId = req.params.spotId;

    let spot = await Spot.findOne({
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
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    const countReviews = await spot.getReviews({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('review')), 'numReviews'], [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStarRating']],
        where: {
            spotId: spot.id
        },
        raw: true
    });

    spot = spot.toJSON();

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
        const spotBookings = await Booking.findAll({
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
        const spotBookings = await Booking.findAll({
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
    handleValidationErrors
];

router.post('/', requireAuth, checkProvidedData, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;

    const spot = await Spot.create({
        ownerId: user.id,
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

router.put('/:spotId', [requireAuth, spotExists], checkProvidedData, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;

    if (user.id === spot.ownerId) {
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
    } else {
        return res.status(403).json({
            message: "Forbidden"
        });
    }
});

const checkImageData = [
    check('url')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Spot image must have a url'),
    check('preview')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Spot image must indicate if it has a preview or not'),
    handleValidationErrors
];

router.post('/:spotId/images', [requireAuth, spotExists], checkImageData, async (req, res, next) => {
    const { url, preview } = req.body;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;

    if (user.id !== spot.ownerId) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }

    const spotImage = await SpotImage.create({
        spotId: spotId,
        url,
        preview
    });

    return res.status(200).json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    });
});

const checkReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isNumeric({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

router.post('/:spotId/reviews', [requireAuth, spotExists], checkReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;

    let findReviews = await Review.findAll({
        where: {
            spotId: spotId
        }
    });

    for (let oneReview of findReviews) {
        if (oneReview.userId === user.id) {
            return res.status(500).json({
                message: 'User already has a review for this spot'
            });
        }
    }
    const addReview = await Review.create({
        userId: user.id,
        spotId: spotId,
        review,
        stars
    });

    return res.status(201).json(addReview);
});

router.post('/:spotId/bookings', [requireAuth, spotExists], async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;

    const allBookings = await Booking.findAll({
        where: {
            spotId: spotId
        }
    });

    if (spot.ownerId !== user.id) {
        for (let booking of allBookings) {
            const startToDate = new Date(startDate);
            const startTime = startToDate.getTime();
            const endToDate = new Date(endDate);
            const endTime = endToDate.getTime();

            if (booking.startDate.getTime() === startTime) {
                return res.status(403).json({
                    message: 'Sorry, this spot is already booked for the specified dates',
                    errors: {
                        startDate: 'Start date conflicts with an existing booking'
                    }
                });
            } else if (booking.endDate.getTime() === endTime) {
                return res.status(403).json({
                    message: 'Sorry, this spot is already booked for the specified dates',
                    errors: {
                        endDate: 'End date conflicts with an existing booking'
                    }
                });
            }
        }

        if (startDate < endDate) {
            const createBooking = await Booking.create({
                spotId: spotId,
                userId: user.id,
                startDate,
                endDate
            });

            return res.status(200).json(createBooking);
        } else {
            res.status(400).json({
                message: "Bad Request",
                errors: "endDate cannot be on or before startDate"
            });
        }
    } else {
        res.status(403).json({
            message: 'You cannot book your own spot silly!'
        });
    }
})

router.delete('/:spotId', [requireAuth, spotExists], async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    const { user } = req;

    if (user.id === spot.ownerId) {
        await spot.destroy();
        res.status(200).json({
            message: 'Successfully deleted'
        });
    } else {
        return res.status(403).json({
            message: "Forbidden"
        });
    }
});


module.exports = router;
