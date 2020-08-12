const express = require('express');
require('dotenv').config();

const db = require('../database/connection');
const isLoggedIn = require('./checkAuth.js');
const {validationResult} = require('express-validator');
const isValid = require('./validation.js');

const adminRouter = express.Router();

adminRouter.get('/checkAuth', isLoggedIn, (req, res) => {
  return res.status(200).send();
})

adminRouter.post('/masters', isLoggedIn, isValid("masterPostPut"),(req, res) => {
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

    db.any(sql, newMaster)
      .then(result => result)
      .catch(err => console.log("ERROR, MASTER WAS NOT ADDED"))
      .then(() => db.any(selectLastAdded))
      .then(result => res.send(result[0]))
      .catch(err => console.log("ERROR"))
  }
})

adminRouter.post('/cities', isLoggedIn, isValid("cityPostPut"), (req, res) => {
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

adminRouter.delete("/cities/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM cities WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT DELETED"))
});

adminRouter.put("/cities/:id", isLoggedIn, isValid("cityPostPut"), (req, res) => {
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

adminRouter.delete("/masters/:id", isLoggedIn, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM masters WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, MASTER WAS NOT DELETED"))
});

adminRouter.put("/masters/:id", isLoggedIn, isValid("masterPostPut"), (req, res) => {
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

adminRouter.put("/prices/:id", isLoggedIn, isValid("pricesPut"), (req, res) => {
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

module.exports = adminRouter;
