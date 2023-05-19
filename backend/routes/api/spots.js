const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Spot, SpotImage, Review } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const Spots = await Spot.findAll({
        raw: true
    });
    for (let spot of Spots) {
        const reviewAvg = await Review.findOne({
            attributes: [[Sequelize.fn('avg', Sequelize.col('stars')), 'avgRating']],
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
    let { page, size, minLat, maxLat, minLng, minPrice, maxPrice } = req.query;

    page = page === undefined ? 1 : page;
    size = size === undefined ? 20 : size;

    res.json({
        Spots,
        page,
        size
    });
});

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const Spots = await Spot.findAll({
        raw: true,
        where: {
            ownerId: user.id
        }
    });

    for (let spot of Spots) {
        const reviewAvg = await Review.findOne({
            attributes: [[Sequelize.fn('avg', Sequelize.col('stars')), 'avgRating']],
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
    res.status(200).json(Spots);
});

router.get('/:spotId', async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    spot.numReviews = 11;

    if (spot) {
        res.json(spot);
    } else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
});

router.get('/:spotId/reviews', async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        const spotReview = await spot.getReviews();
        const reviewImages = await spotReview.getReviewImages();
        const payload = {
            Reviews: spotReview,
            ReviewImages: reviewImages
        }
        res.status(200).json(payload);
    } else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
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

router.put('/:spotId', requireAuth, checkProvidedData, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        if (spot.ownerId === user.id) {
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
            res.status(403).json({
                message: "Spot must belong to you in order to edit it."
            });
        }
    } else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
});

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body;
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        if (spot.ownerId === user.id) {
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
        } else {
            res.status(403).json({
                message: 'Spot must belong to you in order to add an image.'
            })
        }
    } else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
});

router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        if (spot.ownerId === user.id) {
            const addReview = await spot.set({
                review,
                stars
            });
            await addReview.save();
            return res.status(201).json(spot);
        } else {
            res.status(403).json({
                message: 'Spot must belong to you in order to add a review.'
            })
        }
    } else {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }
});

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        if (spot.ownerId === user.id) {
            await spot.destroy();
            res.status(200).json({
                message: 'Successfully deleted'
            })
        } else {
            res.status(403).json({
                message: 'Spot must belong to you in order to delete it.'
            });
        }
    } else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
});


module.exports = router;
