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
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
});

module.exports = user