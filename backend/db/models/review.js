'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.hasMany(
        models.ReviewImage,
        { foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true }
      );

      Review.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      );

      Review.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      )
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
