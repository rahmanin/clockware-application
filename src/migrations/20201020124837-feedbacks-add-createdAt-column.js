'use strict';

const sequelize = require("../database/connection");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('feedbacks_clients', 'createdAt', {
      type: Sequelize.DATE
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('feedbacks_clients', 'createdAt');
  }
};