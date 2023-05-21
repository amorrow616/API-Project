const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Review, Spot, User, ReviewImage } = require('../../db/models');

const router = express.Router();

const reviewExists = async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }
    next();
};

const authorizationReq = async (req, res, next) => {
    const { user } = req;

    if (Review.userId !== user.id) {
        return res.status(403).json({
            message: "Review must belong to you in order to manipulate it."
        });
    }
    next();
};

router.get('/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    let userReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    res.status(200).json({
        Reviews: userReviews
    });
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

router.put('/:reviewId', [requireAuth, reviewExists, authorizationReq], checkProvidedData, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const foundReview = await Review.findByPk(reviewId);

    const { review, stars } = req.body;

    foundReview.set({
        review: review || foundReview.review,
        stars: stars || foundReview.stars
    });

    await foundReview.save();
    res.status(200).json(foundReview);
});

router.post('/:reviewId/images', [requireAuth, reviewExists], async (req, res, next) => {
    const { url } = req.body;
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);
    const { user } = req;

    const allImages = await ReviewImage.findAll({
        where: {
            reviewId: review.id
        }
    });

    if (user.id !== review.userId) {
        return res.status(403).json({
            message: "Review must belong to you in order to manipulate it."
        });
    }

    if (allImages.length >= 10) {
        return res.status(403).json({
            message: 'Maximum number of images for this resource was reached'
        });
    }

    const addImages = await ReviewImage.create({
        reviewId: reviewId,
        url
    });

    return res.status(200).json({
        id: addImages.id,
        url: addImages.url
    });

});

router.delete('/:reviewId', [requireAuth, reviewExists, authorizationReq], async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);


    await review.destroy();
    res.status(200).json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
