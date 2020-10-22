const order = require('../models/orders');
const client = require('../models/clients');
const master = require('../models/masters');
const sendEmailFunc = require('../email/sendEmail.js');
const sendFeedbackEmailFunc = require('../email/sendFeedbackEmailFunc.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Op } = require("sequelize");

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

const finishOrder = (req, res) => {
  const order_id = req.params.id;
  const {
    feedback_master,
    additional_price,
    is_done,
    client_email
  } = req.body;
  const master_id = req.userData.userId
  
  const token = jwt.sign(
    {
      order_id: order_id,
      master_id: master_id
    }, 
    process.env.SECRETKEY, 
    {
      expiresIn: '1d'
    }
  );

  order.update(
    {
      feedback_master: feedback_master,
      additional_price: additional_price,
      is_done: is_done
    },
    {
      where: {
        order_id: order_id,
        master_id: master_id
      }
    }
  )
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, ORDER WAS NOT UPDATED", err))
    .then(() => order.findOne(
      {
        where: {
          order_id: order_id
        },
        attributes: [
          'size', 
          'city', 
          'order_date', 
          'order_time_start', 
          'order_master', 
          'feedback_master', 
          'order_price', 
          'additional_price'
        ]
      }
    ))
    .then(result => {
      sendFeedbackEmailFunc(
        client_email,
        `https://clockware-app.herokuapp.com/feedback?token=${token}&order=${JSON.stringify(result)}`
      )
    })
    .catch(err => console.log("SOME ERRORS WHEN FINISHING ORDER", err))
}

const sendFeedback = (req, res) => {

  const {
    order_id,
    master_id
  } = req.userData;

  const {
    feedback_client,
    evaluation,
    votes,
    rating
  } = req.body;
  console.log("votes",votes)
  order.findOne(
    {
      where: {
        order_id: order_id
      },
      attributes: [
        'evaluation', 
      ]
    }
  )
    .then(result => {
      if (result.evaluation === null) {
        order.update(
          {
            feedback_client: feedback_client,
            evaluation: evaluation
          },
          {
            where: {
              order_id: order_id
            }
          }
        )
          .then(() => master.update(
            {
              votes: votes,
              rating: rating
            },
            {
              where: {
                id: master_id
              }
            }
          ))
          .then(() => res.send({msg: "Thank You for your feedback!"}))
          .catch(error => {
            console.log("CLIENT FEEDBACK - ERROR", error)
          })
      } else {
        console.log("FEEDBACK WAS WRITTEN")
        res.send({err_msg: "Feedback was already written"})
      }
    })

}

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalOrders, rows: orders } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalOrders / limit);
  return { totalOrders, orders, totalPages, currentPage };
};

const getOrdersPagination = (req, res) => {
  const { 
    page,
    size,
    city,
    master_id,
    order_date,
    isSortedByDESC,
    // show_finished
  } = req.body;

  const { limit, offset } = getPagination(page, size);

  order.findAndCountAll({
    where: {
      city: city || { [Op.not]: null },
      order_date: order_date || { [Op.not]: null },
      master_id: master_id || { [Op.not]: null},
      // is_done: show_finished || { [Op.not]: null},
    },
    include: [{
      model: client,
    }],
    order: [
      isSortedByDESC ? ['order_date', 'DESC']
      : 
      ['order_date', 'ASC']
    ],
    limit,
    offset
  })
  .then(result => {
    const response = getPagingData(result, page, limit);
    res.send(response)
  })
  .catch(err => console.log("ERROR ORDERS TEST", err))
}

module.exports = {
  postOrder,
  getOrdersByCityByDate,
  finishOrder,
  sendFeedback,
  getOrdersPagination,
}