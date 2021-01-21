'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.changeColumn('cities', 'city', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.changeColumn('cities', 'city', {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false
    });
  }
};
