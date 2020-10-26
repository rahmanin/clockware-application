const order = require('../models/orders');
const client = require('../models/clients');
const master = require('../models/masters');
const feedback = require('../models/feedbacks');
const sendEmailFunc = require('../email/sendEmail.js');
const sendFeedbackEmailFunc = require('../email/sendFeedbackEmailFunc.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Op } = require("sequelize");
const Validator = require('validatorjs');

const postOrder = (req, res) => {
  const timeStartArray = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ]
  const timeEndArray = [
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ]
  const rules = {
    client_name: "required|min:2|max:15",
    client_email: "required|max:35|email",
    size: "required|in:Small,Medium,Large",
    city: "required|max:20",
    order_date: "required|date",
    order_time_start: `required|in:${timeStartArray}`,
    order_time_end: `required|in:${timeEndArray}`,
    order_master: "required|max:20",
    order_price: "required|integer"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
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
  } else {
    console.log("ERROR POST ORDER")
  }
}

const getOrdersByCityByDate = (req, res) => {
  const rules = {
    city: "required|max:20",
    order_date: "required|date",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
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
  } else {
    console.log("ERROR GET ORDERS BY DATE")
  }
}

const finishOrder = (req, res) => {
  const rules = {
    feedback_master: "max:100",
    additional_price: "integer",
    is_done: "required|boolean"
  }
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
        // `https://clockware-app.herokuapp.com/feedback?token=${token}&order=${JSON.stringify(result)}`
        `http://localhost:3000/feedback?token=${token}&order=${JSON.stringify(result)}`

      )
    })
    .catch(err => console.log("SOME ERRORS WHEN FINISHING ORDER", err))
}

const sendFeedback = (req, res) => {
  const rules = {
    feedback_client: "max:100",
    evaluation: "required|min:1|max:5|integer",
    rating: "required|min:1|max:5",
    votes: "required|integer"
  }

  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
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
    
    feedback.findOne(
      {
        where: {
          order_id: order_id
        }
      }
    )
      .then(result => {
        if (!result) {
          feedback.create(
            {
              evaluation: evaluation,
              feedback: feedback_client,
              master_id: master_id,
              order_id: order_id,
              createdAt: new Date()
            }
          )
          .then(() => order.update(
            {
              feedback_client_id: order_id
            },
            {
              where: {
                order_id: order_id
              }
            }
          ))
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
  } else {
    console.log("FEDDBACK PARAMS ERROR")
  }
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
  const rules = { 
    page: "integer",
    size: "integer",
    city: "max:20",
    master_id: "integer",
    order_date: "date",
    isSortedByDESC: "boolean",
    show_finished: "boolean"
  } 

  const validation = new Validator(req.body, rules);
  if (validation.passes()) {
    const { 
      page,
      size,
      city,
      master_id,
      order_date,
      isSortedByDESC,
      show_finished
    } = req.body;

    const { limit, offset } = getPagination(page, size);

    if (show_finished === null || show_finished === undefined) {
      order.findAndCountAll({
        where: {
          city: city || { [Op.not]: null },
          order_date: order_date || { [Op.not]: null },
          master_id: master_id || { [Op.not]: null},
        },
        include: [{
          model: client,
        },
        {
          model: feedback
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
        console.log(result.dataValues)
        const response = getPagingData(result, page, limit);
        res.send(response)
      })
      .catch(err => console.log("ERROR ORDERS TEST", err))
    } else {
      order.findAndCountAll({
        where: {
          city: city || { [Op.not]: null },
          order_date: order_date || { [Op.not]: null },
          master_id: master_id || { [Op.not]: null},
          is_done: show_finished 
        },
        include: [{
          model: client
        },
        {
          model: feedback
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
  } else {
    console.log("ERROR FILTER ORDERS")
  }
}

module.exports = {
  postOrder,
  getOrdersByCityByDate,
  finishOrder,
  sendFeedback,
  getOrdersPagination,
}