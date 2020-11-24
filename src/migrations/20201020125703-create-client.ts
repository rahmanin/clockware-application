'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
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

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('clients');
  }
};
