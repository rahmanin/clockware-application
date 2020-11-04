const { DataTypes } = require('sequelize');

const sequelize = require('../database/connection')

const mail_report_info = sequelize.define('mail_report_infos', {
  createdAt: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.BOOLEAN
  }
}, {
});

module.exports = mail_report_info
