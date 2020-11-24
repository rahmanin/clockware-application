'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.changeColumn('orders', 'client_id', {
      type: Sequelize.INTEGER,
      references: {
          model: 'users',
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.changeColumn('orders', 'client_id', {
      type: Sequelize.INTEGER,
      references: {
          model: 'clients',
          key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  }
};
