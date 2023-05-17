const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Review } = require('../../db/models');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const userReviews = await Review.findAll({
        where: {
            userId: user.id
        }
    });
    res.json(userReviews);
});

module.exports = router;
