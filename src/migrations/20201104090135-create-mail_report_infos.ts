'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('mail_report_infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.BOOLEAN
      }
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.dropTable('mail_report_infos');
  }
};
