'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return queryInterface.bulkInsert('cities', [{
      city: 'Dnipro',
      delivery_area: JSON.stringify([
        { lat: 48.468401, lng: 35.037788 },
        { lat: 48.464442, lng: 35.033042 },
        { lat: 48.462938, lng: 35.041843 }
      ])
    }]);
  },

  down: async (queryInterface: any, Sequelize: any) => {
    return queryInterface.bulkDelete('cities', null, {});
  }
};
