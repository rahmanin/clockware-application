'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('masters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      master_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rating: {
        type: Sequelize.REAL,
      },
      votes: {
        type: Sequelize.INTEGER,
      }
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('masters');
  }
};
