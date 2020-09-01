const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const getAccess = require('../middlewares/getAccess.js');
const {validationResult} = require('express-validator');
const isValid = require('../middlewares/validation.js');
const sendFeedbackEmailFunc = require('../email/sendFeedbackEmailFunc.js');

const adminRouter = express.Router();

adminRouter.post('/api/masters', getAccess, isValid("masterPostPut"),(req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else if (req.userData.is_admin) {
    console.log(req.userData.is_admin)
    const {
      master_name,
      city,
    } = req.body;

    const newMaster = [master_name, city];
    const sql = "INSERT INTO masters (master_name, city) VALUES ($1,$2)";
    const selectLastAdded = 'SELECT * FROM masters WHERE id=(SELECT MAX(id) FROM masters)';
    const insertIntoUsers = 'INSERT INTO users (id, username) VALUES ($1, $2)'


    db.any(sql, newMaster)
      .then(result => result)
      .catch(err => console.log("ERROR, MASTER WAS NOT ADDED"))
      .then(() => db.any(selectLastAdded))
      .then(result => {
        res.send(result[0]);
        db.any(insertIntoUsers, [result[0].id, master_name + result[0].id]);
      })
      .catch(err => console.log("ERROR"))
  }
})

adminRouter.post('/api/cities', getAccess, isValid("cityPostPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else if (req.userData.is_admin) {
    console.log(req.userData.is_admin)
    const city = req.body.city;
    const sql = "INSERT INTO cities (city) VALUES ($1)";
    const selectLastAdded = 'SELECT * FROM cities WHERE id=(SELECT MAX(id) FROM cities)';

    db.any(sql, [city])
      .then(result => result)
      .catch(err => console.log("ERROR, CITY WAS NOT ADDED"))
      .then(() => db.any(selectLastAdded))
      .then(result => res.send(result[0]))
      .catch(err => console.log("ERROR"))
  }
})

adminRouter.delete("/api/cities/:id", getAccess, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM cities WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT DELETED"))
});

adminRouter.put("/api/cities/:id", getAccess, isValid("cityPostPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else if (req.userData.is_admin) {
    console.log(req.userData.is_admin)
    const city = req.body.city;
    const id = req.params.id;
    const editedCity = [city, id];
    const sql = "UPDATE cities SET city=$1 WHERE id=$2"

    db.any(sql, editedCity)
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, CITY WAS NOT UPDATED"))
  }
});

adminRouter.delete("/api/masters/:id", getAccess, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM masters WHERE id=$1";
  const sqlUsers = "DELETE FROM users WHERE id=$1";

  db.any(sql, [id])
    .then(db.any(sqlUsers, [id]))
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, MASTER WAS NOT DELETED"))
});

adminRouter.put("/api/masters/:id", getAccess, isValid("masterPostPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else if (req.userData.is_admin) {
    console.log(req.userData.is_admin)
    const id = req.params.id;
    const {
      master_name,
      city,
    } = req.body;
    
    const editedMaster = [master_name, city, id];
    const sql = "UPDATE masters SET master_name=$1, city=$2 WHERE id=$3";

    db.any(sql, editedMaster)
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, MASTER WAS NOT UPDATED"))
  }
});

adminRouter.put("/api/prices/:id", getAccess, isValid("pricesPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else if (req.userData.is_admin) {
    console.log(req.userData.is_admin)
    const price = req.body.price;
    const id = req.params.id;
    const editedPrice = [price, id];
    const sql = "UPDATE size SET price=$1 WHERE id=$2"

    db.any(sql, editedPrice)
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, PRICE WAS NOT UPDATED"))
  }
});

adminRouter.put("/api/masterPass/:id", getAccess, isValid("masterPass"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else if (req.userData.is_admin) {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return console.log("ERROR")
      } else {
      db.query("UPDATE users SET password=$1 WHERE id=$2", [hash, req.params.id])
        .then(result => res.json(result))
        .catch(error => {
          console.log("NEW MASTERLOGIN - ERROR", error)
        })
      }
    })
  }
});

adminRouter.put("/api/orders/:id", getAccess, isValid("orderPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    const order_id = req.params.id;
    const {
      feedback_master,
      additional_price,
      is_done,
      client_email
    } = req.body;
    const master_id = req.userData.userId
    const toFinishOrder = [feedback_master, additional_price, is_done, order_id, master_id];
    const sql = "UPDATE orders SET feedback_master=$1, additional_price=$2, is_done=$3 WHERE order_id=$4 AND master_id=$5";
    const orderSql = 'SELECT size, city, order_date, order_time_start, order_master, feedback_master, order_price, additional_price FROM orders WHERE order_id=$1';

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
    

    db.any(sql, toFinishOrder)
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, ORDER WAS NOT UPDATED", err))
      .then(db.any(orderSql, [order_id])
        .then(result => {
          sendFeedbackEmailFunc(
            client_email,
            `https://clockware-app.herokuapp.com/feedback?token=${token}&order=${JSON.stringify(result[0])}`)
        })
      )
      .catch(err => console.log("SOME ERRORS", err))

  }
});

adminRouter.post('/api/check_token', getAccess, (req, res) => {
  const {
    userId,
    is_admin
  } = req.userData;

  res.json({userId, is_admin})
});

module.exports = adminRouter;

