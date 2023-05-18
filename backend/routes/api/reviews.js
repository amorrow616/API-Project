const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Review, Spot, User } = require('../../db/models');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const userReviews = await Review.findAll({
        where: {
            userId: user.id
        }
    });
    res.status(200).json(userReviews);
});

const checkProvidedData = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.put('/:reviewId', requireAuth, checkProvidedData, async (req, res, next) => {
    const { user } = req;
    const reviewId = req.params.reviewId;
    const foundReview = await Review.findByPk(reviewId);

    const { review, stars } = req.body;

    if (foundReview) {
        if (foundReview.userId === user.id) {
            foundReview.set({
                review: review || foundReview.review,
                stars: stars || foundReview.stars
            });

            await foundReview.save();
            res.status(200).json(foundReview);
        } else {
            res.json({
                message: 'Review must belong to you in order to edit it.'
            });
        }
    } else {
        res.status(404).json({
            message: "Review couldn't be found"
        });
    }
});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);

    if (review) {
        if (review.userId === user.id) {
            await review.destroy();
            res.status(200).json({
                message: 'Successfully deleted'
            });
        } else {
            res.json({
                message: 'Review must belong to you in order to delete it.'
            });
        }
    } else {
        res.status(404).json({
            message: "Review couldn't be found"
        });
    }
});

module.exports = router;
