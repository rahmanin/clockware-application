const express = require('express');
const mysql = require("mysql2");
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const { response } = require('express');
const app = express();
app.use(express.static(path.join(__dirname, '/client/build')));
require('dotenv').config();
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD
}).promise();

app.get('/cities', function (req, res) {
  connection.query(`SELECT * FROM cities`)
    .then(result => res.json(result[0]))
    .catch(err => console.log("error", err));
})

app.get('/masters', function (req, res) {
  connection.query(`SELECT * FROM masters`)
    .then(result => res.json(result[0]))
    .catch(err => console.log("error", err));
})

app.get('/size', function (req, res) {
  connection.query(`SELECT * FROM size`)
    .then(result => res.json(result[0]))
    .catch(err => console.log("error", err));
})

app.get('/orders', function (req, res) {
  connection.query(`SELECT * FROM orders`)
    .then(result => res.json(result[0]))
    .catch(err => console.log("error", err));
})

app.post('/orders', urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const client_name = req.body.client_name;
    const client_email = req.body.client_email;
    const size = req.body.size;
    const city = req.body.city;
    const order_date = req.body.order_date;
    const order_master = req.body.order_master;
    const order = [client_name, client_email, size, city, order_date, order_master];
    const sql = "INSERT INTO orders (client_name, client_email, size, city, order_date, order_master) VALUES (?,?,?,?,?,?)";
    
    connection.query(sql, order)
      .then(result => res.json(result[0]))
      .catch(err => console.log("error", err));
})

app.post('/masters', function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const master_name = req.body.master_name;
    const city = req.body.city;
    const rating = req.body.rating;
    const newMaster = [master_name, city, rating];
    const sql = "INSERT INTO masters (master_name, city, rating) VALUES (?,?,?)";
    
    connection.query(sql, newMaster)
      .then(result => res.json(result[0]))
      .catch(err => console.log("error", err));
})

app.post('/cities', function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const city = req.body.city;
    const sql = "INSERT INTO cities (city) VALUES (?)";
    
    connection.query(sql, [city])
      .then(result => res.json(result[0]))
      .catch(err => console.log("error", err));
})

app.delete("/cities/:id", function(req, res){
    const id = req.params.id;
    const sql = "DELETE FROM cities WHERE id=?";

    connection.query(sql, [id])
      .then(result => res.json(result[0]))
      .catch(err => console.log("error", err));
  });

app.put("/cities/:id", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const city = req.body.city;
  const id = req.params.id;
  const editedCity = [city, id];
  const sql = "UPDATE cities SET city=? WHERE id=?"

  connection.query(sql, editedCity)
    .then(result => res.json(result[0]))
    .catch(err => console.log("error", err));
});

app.delete("/masters/:id", function(req, res){
    const id = req.params.id;
    const sql = "DELETE FROM masters WHERE id=?";

    connection.query(sql, [id])
      .then(result => res.json(result[0]))
      .catch(err => console.log("error", err));
});

app.put("/masters/:id", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const id = req.params.id;
  const master_name = req.body.master_name;
  const city = req.body.city;
  const rating = req.body.rating;
  const editedMaster = [master_name, city, rating, id];
  const sql = "UPDATE masters SET master_name=?, city=?, rating=? WHERE id=?";

  connection.query(sql, editedMaster)
    .then(result => res.json(result[0]))
    .catch(err => console.log("error", err));
});


const port = process.env.PORT || 3006;
app.listen(port);
