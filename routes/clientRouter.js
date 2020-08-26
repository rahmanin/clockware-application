const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config();
 
const isValid = require('./validation.js');
const sendEmailFunc = require('./sendEmail.js');
const db = require('../database/connection');
const getClientAccess = require('./getClientAccess.js');

const clientRouter = express.Router();

clientRouter.get('/api/cities', (req, res) => {
  db.any('SELECT * FROM cities;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

clientRouter.get('/api/masters', (req, res) => {
  db.any('SELECT id, master_name, city, rating FROM masters;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

clientRouter.get('/api/size', (req, res) => {
  db.any('SELECT * FROM size;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

clientRouter.get('/api/orders', (req, res) => {
  db.any('SELECT * FROM orders JOIN clients ON clients.id = orders.client_id;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

clientRouter.post('/api/orders_by_city', isValid('orders_by_city'),(req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    db.any('SELECT order_time_end, order_time_start, order_master FROM orders WHERE city=$1 AND order_date=$2;', [req.body.city, req.body.order_date])
      .then(result => res.json(result))
      .catch(err => console.log("error"));
  }
})

clientRouter.post('/api/orders', isValid('postOrder'), (req, res) => {

  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
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

    const order = [
      client_email,
      size, 
      city, 
      order_date, 
      order_master, 
      order_price, 
      master_id, 
      order_time_start, 
      order_time_end
    ];

    const client = [client_name, client_email];
    const sql_order = "INSERT INTO orders (client_id, size, city, order_date, order_master, order_price, master_id, order_time_start, order_time_end) VALUES ((SELECT id FROM clients WHERE client_email=$1),$2,$3,$4,$5,$6,$7,$8,$9)";
    const sql_client = "INSERT INTO clients (client_name, client_email) VALUES ($1,$2)";

    db.any(sql_client, client)
      .then(() => console.log("CLIENT ADDED"))
      .catch(err => console.log("Client already exists"))
      .then(
        db.any(sql_order, order)
          .then(() => console.log("ORDER ADDED"))
          .catch(err => console.log("ERROR, ORDER WAS NOT ADDED", err))
      )
      .then(() => sendEmailFunc(client_name, client_email, size, city, order_date, order_master, order_price, order_time_start))
      .then(() => res.send({msg: 'Yor order was formed and sent by email! Thank you for choosing CLOCKWARE'}))
      .catch(err => console.log("SOME ERRORS WHEN CREATING ORDER"))
  }      
})

clientRouter.post('/api/login', isValid("logIn"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    db.query(`SELECT * FROM users WHERE username = $1;`, [req.body.username])
      .then(result => {
        if (!result.length) return res.status(401).send({msg: 'Entered name is incorrect!'});
        bcrypt.compare(req.body.password, result[0].password)
          .then(resultBcrypt => {
            if (!resultBcrypt) return res.status(401).send({msg: 'Entered password is incorrect!'});
            const token = jwt.sign(
              {
                username: result[0].username, 
                userId: result[0].id,
                is_admin: result[0].is_admin
              }, 
              process.env.SECRETKEY, 
              {
                expiresIn: '1d'
              }
            );
            db.query(`UPDATE users SET last_login = now() WHERE id = $1`, result[0].id);
            res.status(200).json({
              msg: 'Logged in!',
              token,
              is_admin: result[0].is_admin,
              userId: result[0].id
            });
            console.log("LOGGING IN FINISHED SUCCESSFULLY")
          })
          .catch(err => console.log("ERROR WHEN COMPARE", err))
      })
      .catch(error => console.log("ERROR WHEN LOG IN", error))
  }
})

clientRouter.post('/api/feedback', getClientAccess, isValid("feedbackClient"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    const order_id = req.userData.order_id;
    const {
      feedback_client,
      evaluation
    } = req.body;

    const sql = "UPDATE orders SET feedback_client=$1, evaluation=$2 WHERE order_id=$3"
    const updateOrder = [
      feedback_client,
      evaluation, 
      order_id, 
    ];

    db.query("SELECT evaluation FROM orders WHERE order_id=$1", [order_id])
      .then(result => {
        if (result[0].evaluation === null) {
          db.query(sql, updateOrder)
            .then(() => res.send({msg: "Thank You for your feedback!"}))
            .catch(error => {
              console.log("CLIENT FEEDBACK - ERROR", error)
            })
        } else {
          res.send({err_msg: "Feedback was already written"})
        }
      })
      
  }
})

module.exports = clientRouter;
