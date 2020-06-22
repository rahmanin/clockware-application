const express = require('express');
const mysql = require("mysql2");
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static('/client/build'))

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

app.post('/orders', urlencodedParser, function (req, res) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", req)
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

const port = process.env.PORT || 3006;
app.listen(port);
