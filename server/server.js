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

app.listen(3006)
