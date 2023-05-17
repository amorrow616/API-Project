const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Spot, SpotImage, Review } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    let { page, size, minLat, maxLat, minLng, minPrice, maxPrice } = req.query;

    page = page === undefined ? 1 : page;
    size = size === undefined ? 20 : size;

    res.json({
        spots,
        page,
        size
    });
});

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const userSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    });
    res.json(userSpots);
});

router.get('/:spotId', async (req, res, next) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        res.json(spot);
    } else {
        res.json({
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
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
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
            res.json({
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
            const spotImage = SpotImage.create({
                url,
                preview
            });
            res.status(200).json(spotImage);
        } else {
            res.json({
                message: 'Spot must belong to you in order to add an image.'
            })
        }
    } else {
        res.status(404).json({
            message: "Spot couldn't be found"
        })
    }
});

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
        if (spot.ownerId === user.id) {
            await spot.destroy();
            res.json({
                message: 'Successfully deleted'
            })
        } else {
            res.json({
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
