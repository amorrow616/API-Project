const express = require('express');

const { requireAuth } = require('../../utils/auth');

const { Spot, SpotImage } = require('../../db/models');

const router = express.Router();

const spotImageExists = async (req, res, next) => {
    const spotImgId = req.params.imageId;
    const spotImg = await Spot.findByPk(spotImgId);

    if (!spotImg) {
        res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    }
    next();
};

router.delete('/:imageId', [requireAuth, spotImageExists], async (req, res, next) => {
    const { user } = req;
    const imageId = req.params.imageId;
    const image = await SpotImage.findByPk(imageId);
    const spot = await Spot.findOne({
        where: {
            id: image.spotId
        }
    });

    if (user.id !== spot.ownerId) {
        return res.status(403).json({
            message: "Spot must belong to you in order to manipulate it."
        });
    }

    await image.destroy();
    return res.status(200).json({
        message: 'Successfully deleted'
    });
});

module.exports = router;
