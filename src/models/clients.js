const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')

const client = sequelize.define('client', {
  client_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  client_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
});

module.exports = client