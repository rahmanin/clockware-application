const express = require('express');
const mysql = require("mysql2");
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bodyParser = require("body-parser");
const { response } = require('express');
const app = express();
app.use(express.static(path.join(__dirname, '/client/build')));
require('dotenv').config();
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(cors());
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.POSTGRESQL_HEROKU,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

app.get('/cities', function (req, res) {
  client.query('SELECT * FROM cities;', (err, result) => {
    if(err) return console.log(err);
      res.json(result.rows);
  });
})

app.get('/masters', function (req, res) {
  client.query('SELECT * FROM masters;', (err, result) => {
    if(err) return console.log(err);
      res.json(result.rows);
  });
})

app.get('/size', function (req, res) {
  client.query('SELECT * FROM size;', (err, result) => {
    if(err) return console.log(err);
      res.json(result.rows);
  });
})

app.get('/orders', function (req, res) {
  client.query('SELECT * FROM orders JOIN clients ON clients.id = orders.client_id;', (err, result) => {
    if(err) return console.log(err);
      res.json(result.rows);
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
    const sql_order = "INSERT INTO orders (client_id, size, city, order_date, order_master) VALUES ((SELECT id FROM clients WHERE AND client_email=?),?,?,?)";
    const sql_client = "INSERT INTO clients (client_name, client_email) VALUES (?,?)";

    client.query(sql_client, [client_name, client_email], (err, result) => {
      if(err) return console.log("Client already exists");
        res.json(result.rows);
    });
    
    client.query(sql_order, order, (err, result) => {
      if(err) return console.log("ERROR, ORDER WAS NOT ADDED");
        res.json(result.rows);
    });

})

app.post('/masters', function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const master_name = req.body.master_name;
    const city = req.body.city;
    const rating = req.body.rating;
    const newMaster = [master_name, city, rating];
    const sql = "INSERT INTO masters (master_name, city, rating) VALUES (?,?,?)";
    
    client.query(sql, newMaster, (err, result) => {
      if(err) return console.log("ERROR, MASTER WAS NOT ADDED");
        res.json(result.rows);
    });
})

app.post('/cities', function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const city = req.body.city;
    const sql = "INSERT INTO cities (city) VALUES (?)";
    
    client.query(sql, [city], (err, result) => {
      if(err) return console.log("ERROR, CITY WAS NOT ADDED");
        res.json(result.rows);
    });
})

app.delete("/cities/:id", function(req, res){
    const id = req.params.id;
    const sql = "DELETE FROM cities WHERE id=?";

    client.query(sql, [id], (err, result) => {
      if(err) return console.log("ERROR, CITY WAS NOT DELETED");
        res.json(result.rows);
    });
  });

app.put("/cities/:id", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const city = req.body.city;
  const id = req.params.id;
  const editedCity = [city, id];
  const sql = "UPDATE cities SET city=? WHERE id=?"

  client.query(sql, editedCity, (err, result) => {
    if(err) return console.log("ERROR, CITY WAS NOT UPDATED");
      res.json(result.rows);
  });
});

app.delete("/masters/:id", function(req, res){
    const id = req.params.id;
    const sql = "DELETE FROM masters WHERE id=?";

    client.query(sql, [id], (err, result) => {
      if(err) return console.log("ERROR, MASTER WAS NOT DELETED");
        res.json(result.rows);
    });
});

app.put("/masters/:id", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const id = req.params.id;
  const master_name = req.body.master_name;
  const city = req.body.city;
  const rating = req.body.rating;
  const editedMaster = [master_name, city, rating, id];
  const sql = "UPDATE masters SET master_name=?, city=?, rating=? WHERE id=?";

  client.query(sql, editedMaster, (err, result) => {
    if(err) return console.log("ERROR, MASTER WAS NOT UPDATED");
      res.json(result.rows);
  });
});


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
                      //AUTH//
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

// app.post('/login', function(req, res) {
// 	var login = req.body.username;
//   var password = req.body.password;
//   console.log(login, password)
//   connection.query('SELECT * FROM users WHERE user_name = ? AND password = ?', [login, password])
//     .then(result => {
//       if (result.length > 0) {
//         req.session.loggedin = true;
//         req.session.username = login;
//         res.redirect('/main');      
//         res.json(result[0]);
//       }
//     })
//     .catch(err => console.log("error", err));
// });

// app.get('/main', function(req, res) {
//   response.sendFile(path.join(__dirname, '/client/build/index.html'));
// })
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
                      //AUTH with JWT//
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

// const bcrypt = require('bcryptjs');
// // const uuid = require('uuid');
// const jwt = require('jsonwebtoken');

// app.post('/login', (req, res) => {
//   connection.query(`SELECT * FROM users WHERE username = ${connection.escape(req.body.username)};`,
//     (err, result) => {
//       if (err) {
//         throw err;
//       }
//       if (!result.length) {
//         return res.status(401).send('Entered data is incorrect!');
//       }
//       bcrypt.compare(
//         req.body.password,
//         result[0]['password'],
//         (bErr, bResult) => {
//           if (bErr) {
//             throw bErr;
//           }
//           if (bResult) {
//             const token = jwt.sign({username: result[0].username, userId: result[0].id}, 'SECRETKEY', {expiresIn: '7d'});
//             connection.query(
//               `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
//             );
//             return res.status(200).send({
//               msg: 'Logged in!',
//               token,
//               user: result[0]
//             });
//           }
//           return res.status(401).send({msg: 'Entered data is incorrect!'});
//         }
//       );
//     }
//   );
// });





const port = process.env.PORT || 3006;
app.listen(port);
