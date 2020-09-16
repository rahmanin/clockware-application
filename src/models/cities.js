const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')

const city = sequelize.define('city', {
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
});

module.exports = city