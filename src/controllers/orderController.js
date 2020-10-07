const order = require('../models/orders');
const client = require('../models/clients');
const sendEmailFunc = require('../email/sendEmail.js');

const getOrders = (req, res) => {
  order.findAll({
    include: [{
      model: client,
    }]
  })
    .then(orders => res.json(orders))
    .catch(err => console.log("ERROR GET ORDERS", err));
}

const postOrder = (req, res) => {
  const {
    client_name, 
    client_email, 
    size,
    city,
    order_date,
    order_time_start,
    order_time_end,
    order_master,
    order_price,
    master_id
  } = req.body;

  client.create({
    client_name: client_name,
    client_email: client_email
  })
    .then(() => console.log("CLIENT ADDED"))
    .catch(() => console.log("Client already exists"))
    .then(
      client.findOne({
        where: {
          client_email: client_email
        }
      })
        .then( 
          resp => order.create({
            client_id: resp.id,
            size: size,
            city: city,
            order_date: order_date,
            order_master: order_master,
            order_price: order_price,
            master_id: master_id,
            order_time_start: order_time_start,
            order_time_end: order_time_end
          })
        )
        .catch(() => console.log("ORDER ERROR"))
    )
    .then(() => sendEmailFunc(client_name, client_email, size, city, order_date, order_master, order_price, order_time_start))
    .then(() => res.send({msg: 'Yor order was formed and sent by email! Thank you for choosing CLOCKWARE'}))
    .catch(err => console.log("SOME ERRORS WHEN CREATING ORDER"))
}

const getOrdersByCityByDate = (req, res) => {
  const {
    city,
    order_date
  } = req.body;

  order.findAll({
    where : {
      city: city,
      order_date: order_date,
    }
  })
    .then(result => res.json(result))
    .catch(err => console.log("error"));
}

module.exports = {
  getOrders,
  postOrder,
  getOrdersByCityByDate
}