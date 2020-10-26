const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')

const feedback = sequelize.define('feedbacks_clients', {
  evaluation: {
    type: DataTypes.INTEGER,
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  master_id: {
    type: DataTypes.INTEGER,
  },
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  createdAt: {
    type: DataTypes.DATE
  }
}, {
});

module.exports = feedback
