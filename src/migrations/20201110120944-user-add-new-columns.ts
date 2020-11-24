'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      unique: true
    });
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'role');
  }
};
