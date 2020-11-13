const user = require('../models/users');
const Validator = require('validatorjs');
const bcrypt = require('bcryptjs');

const checkUser = (req, res) => {
  const rules = {
    username: "required|min:2|max:15",
    email: "required|max:35|email",
  }

  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {
      username, 
      email, 
    } = req.body;

    user.findOrCreate({
      where: {
        email: email
      },
      defaults: {
        username: username,
        email: email,
        role: "client"
      }
    })
      .then(result => {
        !result[0].password ? res.json({id: result[0].id}) : res.status(401).send({email: result[0].email})
      })
      .catch(() => {
        console.log("ERROR CHECK USER")
        res.sendStatus(500)
      })
  } else {
    console.log("ERROR CHECK USER")
    res.sendStatus(400)
  }
    
}

const userSetPassword = (req, res) => {
  const rules = {
    password: "required|max:30",
  }
  console.log(req.body.password)
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "client") {
    const id = req.userData.userId;

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        console.log("ERROR")
        return res.sendStatus(500)
      } else {
        user.update(
          {
            password: hash,
          },
          {
            where: {
              id: id
            },
            returning: true,
          }
        )
          .then(result => {
            res.json(result[1])
          })
          .catch(err => {
            console.log("ERROR, USER PASSWORD", err)
            res.sendStatus(500)
          })
      }
    })
  } else {
    console.log("ERROR USER PASSWORD PARAMS")
    res.sendStatus(400)
  }
}

module.exports = {
  checkUser,
  userSetPassword
}