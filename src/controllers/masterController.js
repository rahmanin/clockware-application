const master = require('../models/masters');
const user = require('../models/users');
const bcrypt = require('bcryptjs');
const Validator = require('validatorjs');
const { Op } = require("sequelize");
const sequelize = require('../database/connection')

const getMasters = (req, res) => {
  master.findAll({
    include: [{
      model: user,
      attributes: [["username", "master_name"], "email"]
    }]
  })
    .then(masters => res.json(masters))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR GET MASTERS", err)
    });
}

const getMasterVotesById = (req, res) => {
  const {master_id} = req.userData

  master.findByPk(master_id)
    .then(result => {
      if (!result) return; 
      res.json(result);
    })
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR GET VOTES")
    });
}

const createMaster = (req, res) => {
  const rules = {
    master_name: "required|max:20",
    city: "required|max:20",
    email: "required|max:35|email",
  }

  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const {
      master_name,
      city,
      email
    } = req.body;

    user.create({
      username: master_name,
      email: email,
      role: "master"
    })
      .then(() => console.log("USER WAS ADDED"))
      .catch(err => console.log("ERROR, USER WAS NOT ADDED"))
      .then(() => user.max('id'))
      .then(result => user.findOne({
        where: {
          id: result
        }
      }))
      .then(result => {
        master.create({
          id: result.id,
          city: city,
        })
        .then(master => res.json({
          ...master.dataValues, 
          master_name: master_name, 
          email: email
        }))
      })
      .catch(err => console.log("ERRORS WITH NEW MASTER", err))
  } else {
    console.log("ERROR MASTER POST")
  }
}

const deleteMaster = (req, res) => {
  const id = req.params.id;

  req.userData.role === "admin" && user.destroy({
    where: {
      id: id
    }
  })
    .then(result => res.json(result))
    .catch(err => {
      console.log("ERROR, MASTER WAS NOT DELETED")
      res.sendStatus(401)
    })
}

const updateMaster = (req, res) => {
  const rules = {
    master_name: "required|max:20",
    city: "required|max:20",
    email: "required|max:35|email",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const {
      master_name,
      city,
      email
    } = req.body;

    master.update(
      {
        city: city,
      },
      {
        where: {
          id: id
        }
      }
    )
      .then(() => user.update(
        {
          username: master_name,
          email: email,
        },
        {
          where: {
            id: id
          }
        }
      ))
      .then(result => res.json(result))
      .catch(err => {
        res.sendStatus(500)
        console.log("ERROR, MASTER WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR MASTER PUT")
  }
}

const setMasterPassword = (req, res) => {
  const rules = {
    password: "required|max:30",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;

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
            }
          }
        )
          .then(result => res.json(result))
          .catch(err => {
            res.sendStatus(500)
            console.log("ERROR, MASTER PASSWORD")
          })
      }
    })
  } else {
    res.sendStatus(400)
    console.log("ERROR MASTER PASSWORD")
  }
}

const findMaster = (req, res) => {
  const {searchParam} = req.body

  user.findAll({
    where: {
      username: {[Op.startsWith]: searchParam}
    }
  })
  .then(result => {
    const mastersArray = result.map(master => `${master.username}, id:${master.id}`)
    res.send(mastersArray)
  })
  .catch(err => {
    res.sendStatus(500)
    console.log("ERROR FIND MASTER", err)
  })

}

module.exports = {
  getMasters,
  getMasterVotesById,
  createMaster,
  deleteMaster,
  updateMaster,
  setMasterPassword,
  findMaster
}