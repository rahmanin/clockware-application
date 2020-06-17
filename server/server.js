const express = require('express');
const mysql = require("mysql2");
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER,
  database: "clockware_db",
  password: process.env.MYSQL_PASSWORD
});

app.get('/cities', function (req, res) {
    connection.query(`SELECT * FROM cities`, function(err, result) {
        if(err) return console.log(err);
        res.json(result);
    });
})

app.get('/masters', function (req, res) {
    connection.query(`SELECT * FROM masters`, function(err, result) {
        if(err) return console.log(err);
        res.json(result);
    });
})

app.get('/size', function (req, res) {
    connection.query(`SELECT * FROM size`, function(err, result) {
        if(err) return console.log(err);
        res.json(result);
    });
})

app.get('/orders', function (req, res) {
    connection.query(`SELECT * FROM orders`, function(err, result) {
        if(err) return console.log(err);
        res.json(result);
    });
})

app.post('/orders', function (req, res) {
    const client_name = req.body.client_name;
    const client_email = req.body.client_email;
    const size = req.body.size;
    const city = req.body.city;
    const order_date = req.body.order_date;
    const order_master = req.body.order_master;

    connection.query("INSERT INTO orders (client_name, client_email, size, city, order_date, order_master) VALUES (?,?,?,?,?,?)", [client_name, client_email, size, city, order_date, order_master], function(err) {
        if(err) return console.log(err);
        res.redirect("/kk");
      });
})
app.listen(3006)
