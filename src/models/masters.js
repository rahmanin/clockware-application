const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')

const master = sequelize.define('master', {
  master_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.REAL,
  },
  votes: {
    type: DataTypes.INTEGER,
  }
}, {
});

module.exports = master