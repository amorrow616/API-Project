const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Booking, Spot } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();

const bookingExists = async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(404).json({
            message: "Booking couldn't be found"
        })
    }
    next();
};

const authorizationReq = async (req, res, next) => {
    const { user } = req;

    if (Booking.userId !== user.id) {
        res.status(403).json({
            message: "Booking must belong to you in order to manipulate it."
        });
    }
    next();
};

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const currentUserBookings = await Booking.findAll({
        include: {
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        },
        where: {
            userId: user.id
        }
    });
    let bookingsList = [];

    currentUserBookings.forEach(booking => {
        bookingsList.push(booking.toJSON());
    })
    return res.status(200).json({
        Bookings: bookingsList
    });
});

const checkProvidedData = [
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

router.put('/:bookingId', [requireAuth, bookingExists], checkProvidedData, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);

    if (booking.startDate === startDate || booking.endDate === endDate) {
        return res.status(403).json({
            message: 'Sorry, this spot is already booked for the specified dates',
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        })
    }

    booking.set({
        startDate: startDate || booking.startDate,
        endDate: endDate || booking.endDate
    });

    await booking.save();
    return res.status(200).json(booking)
});

router.delete('/:bookingId', [requireAuth, bookingExists], async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);
    const { user } = req;

    if (booking.userId !== user.id) {
        return res.status(403).json({
            message: "Booking must belong to you in order to manipulate it."
        });
    }

    if (booking.startDate < new Date()) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        });
    }

    await booking.destroy();
    res.status(200).json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
