'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clients', {
      client_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      client_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clients');
  }
};
