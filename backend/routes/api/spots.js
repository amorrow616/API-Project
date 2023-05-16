const express = require('express');
const { Op, ValidationError } = require('sequelize');

const { Spot, User } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll();

    res.json(spots);
});

router.post('/', async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (ValidationError) {
        res.status(400).json({
            message: 'Bad Request',
            errors: {
                address: "Street address is required",
                city: "City is required",
                state: "State is required",
                country: "Country is required",
                lat: "Latitude is not valid",
                lng: "Longitude is not valid",
                name: "Name must be less than 50 characters",
                description: "Description is required",
                price: "Price per day is required"
            }
        });
    } else {
        const spot = await Spot.create({
            ownerId: User.id,
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
    }
});


module.exports = router;
