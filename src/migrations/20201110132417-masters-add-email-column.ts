'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('masters', 'email', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('masters', 'email');
  }
};
