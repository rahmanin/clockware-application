const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')

const user = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
  },
  last_login: {
    type: DataTypes.DATE,
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  role: {
    type: DataTypes.STRING,
  },
}, {
});

module.exports = user