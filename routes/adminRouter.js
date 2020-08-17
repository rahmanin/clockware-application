const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('../database/connection');
const adminAccess = require('./adminAccess.js');
const {validationResult} = require('express-validator');
const isValid = require('./validation.js');

const adminRouter = express.Router();

adminRouter.post('/api/masters', adminAccess, isValid("masterPostPut"),(req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    const {
      master_name,
      city,
      rating
    } = req.body;

    const newMaster = [master_name, city, rating];
    const sql = "INSERT INTO masters (master_name, city, rating) VALUES ($1,$2,$3)";
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

adminRouter.post('/api/cities', adminAccess, isValid("cityPostPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
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

adminRouter.delete("/api/cities/:id", adminAccess, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM cities WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT DELETED"))
});

adminRouter.put("/api/cities/:id", adminAccess, isValid("cityPostPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    const city = req.body.city;
    const id = req.params.id;
    const editedCity = [city, id];
    const sql = "UPDATE cities SET city=$1 WHERE id=$2"

    db.any(sql, editedCity)
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, CITY WAS NOT UPDATED"))
  }
});

adminRouter.delete("/api/masters/:id", adminAccess, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM masters WHERE id=$1";
  const sqlUsers = "DELETE FROM users WHERE id=$1";

  db.any(sql, [id])
    .then(db.any(sqlUsers, [id]))
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, MASTER WAS NOT DELETED"))
});

adminRouter.put("/api/masters/:id", adminAccess, isValid("masterPostPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    const id = req.params.id;
    const {
      master_name,
      city,
      rating
    } = req.body;
    
    const editedMaster = [master_name, city, rating, id];
    const sql = "UPDATE masters SET master_name=$1, city=$2, rating=$3 WHERE id=$4";

    db.any(sql, editedMaster)
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, MASTER WAS NOT UPDATED"))
  }
});

adminRouter.put("/api/prices/:id", adminAccess, isValid("pricesPut"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
    const price = req.body.price;
    const id = req.params.id;
    const editedPrice = [price, id];
    const sql = "UPDATE size SET price=$1 WHERE id=$2"

    db.any(sql, editedPrice)
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, PRICE WAS NOT UPDATED"))
  }
});

adminRouter.put("/api/masterPass/:id", adminAccess, isValid("masterPass"), (req, res) => {
  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  } else {
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

module.exports = adminRouter;
