'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('masters', 'email');
    await queryInterface.removeColumn('masters', 'master_name');
    await queryInterface.changeColumn('masters', 'id', {
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
    await queryInterface.addColumn('masters', 'email', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('masters', 'master_name', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
