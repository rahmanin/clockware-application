const express = require('express');
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

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);
pgp.pg.defaults.ssl = true;

app.get('/cities', (req, res) => {
  db.any('SELECT * FROM cities;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

app.get('/masters', (req, res) => {
  db.any('SELECT * FROM masters;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

app.get('/size', (req, res) => {
  db.any('SELECT * FROM size;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

app.get('/orders', (req, res) => {
  db.any('SELECT * FROM orders JOIN clients ON clients.id = orders.client_id;')
    .then(result => res.json(result))
    .catch(err => console.log("error", err));
})

app.post('/orders', urlencodedParser, (req, res) => {
  if(!req.body) return res.sendStatus(400);

  const {
    client_name, 
    client_email, 
    size,
    city,
    order_date,
    order_master
  } = req.body;
  
  const order = [client_email, size, city, order_date, order_master];
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
})

app.post('/masters', function (req, res) {
  if(!req.body) return res.sendStatus(400);

  const {
    master_name,
    city,
    rating
  } = req.body;

  const newMaster = [master_name, city, rating];
  const sql = "INSERT INTO masters (master_name, city, rating) VALUES ($1,$2,$3)";
  
  db.any(sql, newMaster)
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, MASTER WAS NOT ADDED", err))
})

app.post('/cities', function (req, res) {
  if(!req.body) return res.sendStatus(400);

  const city = req.body.city;
  const sql = "INSERT INTO cities (city) VALUES ($1)";
  
  db.any(sql, [city])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT ADDED"))
})

app.delete("/cities/:id", function(req, res){
  const id = req.params.id;
  const sql = "DELETE FROM cities WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT DELETED"))
});

app.put("/cities/:id", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);

  const city = req.body.city;
  const id = req.params.id;
  const editedCity = [city, id];
  const sql = "UPDATE cities SET city=$1 WHERE id=$2"

  db.any(sql, editedCity)
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT UPDATED"))
});

app.delete("/masters/:id", function(req, res){
  const id = req.params.id;
  const sql = "DELETE FROM masters WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, MASTER WAS NOT DELETED"))
});

app.put("/masters/:id", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);
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
