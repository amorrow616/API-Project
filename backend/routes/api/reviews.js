const express = require('express');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { Review, Spot, User, ReviewImage, SpotImage } = require('../../db/models');

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

    let reviewList = [];
    for (let review of userReviews) {
        reviewList.push(review.toJSON());
    }

    for (let review of reviewList) {
        const previewImage = await SpotImage.findOne({
            where: {
                spotId: review.spotId
            }
        });
        review.Spot.previewImage = previewImage.url;
    }

    res.status(200).json({
        Reviews: reviewList
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

router.put('/:reviewId', [requireAuth, reviewExists], checkProvidedData, async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const foundReview = await Review.findByPk(reviewId);
    const { user } = req;

    const { review, stars } = req.body;

    if (user.id === foundReview.userId) {
        foundReview.set({
            review: review || foundReview.review,
            stars: stars || foundReview.stars
        });

        await foundReview.save();
        res.status(200).json(foundReview);
    } else {
        return res.status(403).json({
            message: "Forbidden"
        });
    }
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
            message: "Forbidden"
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

router.delete('/:reviewId', [requireAuth, reviewExists], async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const review = await Review.findByPk(reviewId);
    const { user } = req;

    if (user.id === review.userId) {
        await review.destroy();
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
