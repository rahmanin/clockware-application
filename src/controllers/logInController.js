const user = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Validator = require('validatorjs');

const logIn = (req, res) => {
  const rules = {
    username: "required|max:35",
    password: "required|max:30"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    user.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(result => {
        if (!result) return res.status(401).send({msg: 'Entered name is incorrect!'});
        bcrypt.compare(req.body.password, result.password)
          .then(resultBcrypt => {
            if (!resultBcrypt) return res.status(401).send({msg: 'Entered password is incorrect!'});
            const token = jwt.sign(
              {
                username: result.username, 
                userId: result.id,
                is_admin: result.is_admin
              }, 
              process.env.SECRETKEY, 
              {
                expiresIn: '100d'
              }
            );
            // db.query(`UPDATE users SET last_login = now() WHERE id = $1`, result[0].id);
            res.status(200).json({
              msg: 'Logged in!',
              token,
              is_admin: result.is_admin,
              userId: result.id
            });
            console.log("LOGGING IN FINISHED SUCCESSFULLY")
          })
          .catch(err => console.log("ERROR WHEN COMPARE", err))
      })
      .catch(error => console.log("ERROR WHEN LOG IN", error))
  } else {
    console.log("LOGIN ERROR")
  }
}

const checkToken = (req, res) => {
  const {
    userId,
    is_admin
  } = req.userData;

  res.json({userId, is_admin})
}

module.exports = {
  logIn,
  checkToken
}