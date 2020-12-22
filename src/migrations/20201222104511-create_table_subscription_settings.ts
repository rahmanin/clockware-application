'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('subscription_settings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      subscription: {
        type: Sequelize.TEXT,
      },
      endpoint: {
        type: Sequelize.TEXT,
      },
      user_token: {
        type: Sequelize.TEXT,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('subscription_settings');
  }
};
