const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmailFunc = async (name, email, size, city, date, master) => {

  const testEmail = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testEmail.user,
      pass: testEmail.pass
    }
  });
  const options = {
    from: `"CLOCKWARE" ${testEmail.user}`,
    to: `${email}`,
    subject: "Your order was formed!",
    text: `Hi, ${name}, Your order was formed! City: ${city} Date: ${date} Size: ${size} Master: ${master}`,
    html: `Hi, <strong>${name}</strong>, Your order was formed! <br> City: <strong>${city}</strong> <br> Date: <strong>${date}</strong> <br> Size: <strong>${size}</strong> <br> Master: <strong>${master}</strong>`
  }

  transporter.sendMail(options)
    .then(result => console.log("MESSAGE WAS SENT"))
    .catch(err => console.log("ERROR EMAIL SENDING", err))
  
}


 

const db = require('../database/connection');

const clientRouter = express.Router();

clientRouter.get('/cities', (req, res) => {
  db.any('SELECT * FROM cities;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

clientRouter.get('/masters', (req, res) => {
  db.any('SELECT * FROM masters;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

clientRouter.get('/size', (req, res) => {
  db.any('SELECT * FROM size;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

clientRouter.get('/orders', (req, res) => {
  db.any('SELECT * FROM orders JOIN clients ON clients.id = orders.client_id;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})








const { validationResult } = require('express-validator');

const isValid = require('./validation.js');









clientRouter.post('/orders', isValid('order'), (req, res) => {
  if(!req.body) return res.sendStatus(400);
  try {
    const errors = validationResult(req); 

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    console.log("VALIDATION", errors);

    const {
      client_name, 
      client_email, 
      size,
      city,
      order_date,
      order_time,
      order_master
    } = req.body;

    const order_dateTime = order_date + "T" + order_time;

    const order = [client_email, size, city, order_dateTime, order_master];
    const client = [client_name, client_email];
    const sql_order = "INSERT INTO orders (client_id, size, city, order_date, order_master) VALUES ((SELECT id FROM clients WHERE client_email=$1),$2,$3,$4,$5)";
    const sql_client = "INSERT INTO clients (client_name, client_email) VALUES ($1,$2)";

    db.any(sql_client, client)
      .then(() => console.log("CLIENT ADDED"))
      .catch(err => console.log("Client already exists"))
      .then(
        db.any(sql_order, order)
          .then(() => console.log("ORDER ADDED"))
          .catch(err => console.log("ERROR, ORDER WAS NOT ADDED", err))
      )
      .then(() => sendEmailFunc(client_name, client_email, size, city, order_dateTime, order_master))
      .then(() => res.send({msg: 'Yor order was formed and sent by email! Thank you for choosing CLOCKWARE'}))
      .catch(err => console.log("SOME ERRORS WHEN CREATING ORDER"))
  } catch(err) {
    return next(err)
  }
})

clientRouter.post('/login', (req, res) => {
  db.query(`SELECT * FROM users WHERE username = $1;`, [req.body.username])
    .then(result => {
      if (!result.length) return res.status(401).send({msg: 'Entered name is incorrect!'});
      bcrypt.compare(req.body.password, result[0].password)
        .then(resultBcrypt => {
          if (!resultBcrypt) return res.status(401).send({msg: 'Entered password is incorrect!'});
          const token = jwt.sign({username: result[0].username, userId: result[0].id}, process.env.SECRETKEY, {expiresIn: '1d'});
          db.query(`UPDATE users SET last_login = now() WHERE id = $1`, result[0].id);
          res.status(200).json({
            msg: 'Logged in!',
            token,
            user: result[0]
          });
          console.log("LOGGING IN FINISHED SUCCESSFULLY")
        })
        .catch(err => console.log("ERROR WHEN COMPARE", err))
    })
    .catch(error => console.log("ERROR WHEN LOG IN", error))
})

module.exports = clientRouter;
