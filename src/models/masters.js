const { DataTypes } = require('sequelize');
const user = require('./users');

const sequelize = require('../database/connection')

const master = sequelize.define('master', {
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.REAL,
  },
  votes: {
    type: DataTypes.INTEGER,
  },
}, {
});

master.belongsTo(user, {foreignKey: 'id'})

module.exports = master