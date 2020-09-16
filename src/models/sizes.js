const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')

const size = sequelize.define('size', {
  size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
  }
}, {
});

module.exports = size