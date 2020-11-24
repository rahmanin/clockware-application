'use strict';
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('feedbacks_clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      evaluation: {
        type: Sequelize.INTEGER,
      },
      feedback: {
        type: Sequelize.TEXT
      },
      master_id: {
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      }
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('feedbacks_clients');
  }
};