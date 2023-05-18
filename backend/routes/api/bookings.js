const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Booking } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const currentUserBookings = await Booking.findAll({
        where: {
            userId: user.id
        }
    });
    res.status(200).json(currentUserBookings);
});

module.exports = router;
