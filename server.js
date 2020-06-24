const express = require('express');
const mysql = require("mysql2");
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
// app.use(express.static(path.join(__dirname, '/client/build')));
require('dotenv').config();
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(cors());
app.use(bodyParser.json());

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
// });

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
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
    
    connection.query(sql, order, function(err, result) {
        if(err) console.log("ERROR", err);
        res.json(result);
    });
    
})

app.post('/masters', function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const master_name = req.body.master_name;
    const city = req.body.city;
    const rating = req.body.rating;
    const newMaster = [master_name, city, rating];
    const sql = "INSERT INTO masters (master_name, city, rating) VALUES (?,?,?)";
    
    connection.query(sql, newMaster, function(err, result) {
        if(err) console.log("ERROR", err);
        res.json(result);
    });
})

app.post('/cities', function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const city = req.body.city;
    const sql = "INSERT INTO cities (city) VALUES (?)";
    
    connection.query(sql, [city], function(err, result) {
        if(err) console.log("ERROR", err);
        res.json(result);
    });
})

const port = process.env.PORT || 3006;
app.listen(port);
