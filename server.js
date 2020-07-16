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

app.get('/', (req, res) => {
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

app.post('/masters', (req, res) => {
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

app.post('/cities', (req, res) => {
  if(!req.body) return res.sendStatus(400);

  const city = req.body.city;
  const sql = "INSERT INTO cities (city) VALUES ($1)";
  
  db.any(sql, [city])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT ADDED"))
})

app.delete("/cities/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM cities WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT DELETED"))
});

app.put("/cities/:id", urlencodedParser, (req, res) => {
  if(!req.body) return res.sendStatus(400);

  const city = req.body.city;
  const id = req.params.id;
  const editedCity = [city, id];
  const sql = "UPDATE cities SET city=$1 WHERE id=$2"

  db.any(sql, editedCity)
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT UPDATED"))
});

app.delete("/masters/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM masters WHERE id=$1";

  db.any(sql, [id])
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, MASTER WAS NOT DELETED"))
});

app.put("/masters/:id", urlencodedParser, (req, res) => {
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
                      //AUTH with JWT//
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ----------------------------------------------------------------------------------------
// Here i added  to db admin-user "admin@example.com" with hashed password "passwordsecret"
// ----------------------------------------------------------------------------------------

// app.post('/login', (req, res) => {
//   bcrypt.hash(req.body.password, 10, (err, hash) => {
//     if (err) {
//       return console.log("ERROR")
//     } else {
//     db.query("INSERT INTO users (username, password, last_login) VALUES ($1, $2, now())", [req.body.username, hash])
//       .then(r => console.log("NEW USER - SUCCESS"))
//       .catch(e => console.log("NEW USER - ERROR", e))
//     }
//   })
// })


app.post('/login', (req, res) => {
  db.query(`SELECT * FROM users WHERE username = $1;`, [req.body.username])
    .then(result => {
      if (!result.length) return res.status(401).send({msg: 'Entered name is incorrect!'});
      bcrypt.compare(req.body.password, result[0].password)
        .then(resultBcrypt => {
          if (!resultBcrypt) return res.status(401).send({msg: 'Entered password is incorrect!'});
          const token = jwt.sign({username: result[0].username, userId: result[0].id}, 'SECRETKEY', {expiresIn: '7d'});
          db.query(`UPDATE users SET last_login = now() WHERE id = $1`, result[0].id);
          res.status(200).send({
            msg: 'Logged in!!!!!! YEEEEEAAHHHHHH',
            token,
            user: result[0]
          });
          console.log("LOGGING IN FINISHED SUCCESSFULLY")
        })
        .catch(err => console.log("ERROR WHEN COMPARE", err))
    })
    .catch(error => console.log("ERROR WHEN LOG IN", error))
})







const port = process.env.PORT || 3006;
app.listen(port);
