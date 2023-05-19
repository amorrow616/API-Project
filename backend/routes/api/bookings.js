const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Booking, Spot } = require('../../db/models');
const { Sequelize } = require('sequelize');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;
    const currentUserBookings = await Booking.findAll({
        include: Spot,
        where: {
            userId: user.id
        }
    });
    let bookingsList = [];

    currentUserBookings.forEach(booking => {
        bookingsList.push(booking.toJSON());
    })
    res.status(200).json(bookingsList);
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

router.put(':bookingId', requireAuth, checkProvidedData, async (req, res, next) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);

    if (booking) {
        if (booking.userId === user.id) {
            booking.set({
                startDate: startDate || booking.startDate,
                endDate: endDate || booking.endDate
            });

            await booking.save();
            res.status(200).json(booking)
        } else {
            res.status(403).json({
                message: 'Booking must belong to you in order to edit it.'
            });
        }
    } else {
        res.status(404).json({
            message: "Booking couldn't be found"
        });
    }
});

router.delete(':bookingId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);

    if (booking) {
        if (booking.userId === user.id) {
            await booking.destroy();
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
})

module.exports = router;
