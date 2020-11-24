'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('feedbacks_clients', 'createdAt', {
      type: Sequelize.DATE
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('feedbacks_clients', 'createdAt');
  }
};