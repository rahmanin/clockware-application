const { DataTypes } = require('sequelize');
const client = require('./clients');

const sequelize = require('../database/connection')

const order = sequelize.define('order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  order_date: {
    type: DataTypes.STRING,
  },
  order_master: {
    type: DataTypes.STRING,
  },
  evaluation: {
    type: DataTypes.INTEGER,
  },
  feedback_client: {
    type: DataTypes.TEXT,
  },
  feedback_master: {
    type: DataTypes.TEXT,
  },
  order_price: {
    type: DataTypes.INTEGER,
  },
  additional_price: {
    type: DataTypes.INTEGER,
  },
  is_done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  master_id: {
    type: DataTypes.INTEGER,
  },
  order_time_start: {
    type: DataTypes.TEXT,
  },
  order_time_end: {
    type: DataTypes.TEXT,
  },
}, {
});

// client.hasMany(order, {foreignKey: "client_id"});
order.belongsTo(client, {foreignKey: 'client_id'})

module.exports = order