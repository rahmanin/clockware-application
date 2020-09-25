const order = require('../models/orders');
const client = require('../models/clients');

const getOrders = (req, res) => {
  order.findAll({
    include: [{
      model: client,
    }]
  })
    .then(orders => res.json(orders))
    .catch(err => console.log("ERROR GET ORDERS", err));
}

module.exports = {
  getOrders,
}