'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('cities', 'delivery_area', {
      type: Sequelize.TEXT
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('cities', 'delivery_area');
  }
};
