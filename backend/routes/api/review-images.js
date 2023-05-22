const express = require('express');

const { requireAuth } = require('../../utils/auth');

const { Review, Spot, ReviewImage } = require('../../db/models');

const router = express.Router();

const reviewImageExists = async (req, res, next) => {
    const reviewImgId = req.params.imageId;
    const reviewImg = await Spot.findByPk(reviewImgId);

    if (!reviewImg) {
        res.status(404).json({
            message: "Review Image couldn't be found"
        })
    }
    next();
};

router.delete('/:imageId', [requireAuth, reviewImageExists], async (req, res, next) => {
    const imageId = req.params.imageId;
    const image = await ReviewImage.findByPk(imageId);
    const review = await Review.findOne({
        where: {
            id: image.reviewId
        }
    })
    const { user } = req;

    if (user.id !== review.userId) {
        res.status(403).json({
            message: "Forbidden"
        });
    }

    await image.destroy();
    return res.status(200).json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
