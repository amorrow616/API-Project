'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      );

      Booking.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      );
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      endDateCheck(value) {
        if (value.toDateString() >= this.startDate.toDateString()) {
          throw new Error('endDate cannot be on or before startDate');
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
