'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      size: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      order_date: {
        type: Sequelize.STRING,
      },
      order_master: {
        type: Sequelize.STRING,
      },
      evaluation: {
        type: Sequelize.INTEGER,
      },
      feedback_client: {
        type: Sequelize.TEXT,
      },
      feedback_master: {
        type: Sequelize.TEXT,
      },
      order_price: {
        type: Sequelize.INTEGER,
      },
      additional_price: {
        type: Sequelize.INTEGER,
      },
      is_done: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      master_id: {
        type: Sequelize.INTEGER,
      },
      order_time_start: {
        type: Sequelize.TEXT,
      },
      order_time_end: {
        type: Sequelize.TEXT,
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'clients',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};
