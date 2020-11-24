'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('orders', 'image', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('orders', 'image');
  }
};
