const master = require('../models/masters');
const user = require('../models/users');
const bcrypt = require('bcryptjs');
const Validator = require('validatorjs');
const { Op } = require("sequelize");

const getMasters = (req, res) => {
  master.findAll()
    .then(masters => res.json(masters))
    .catch(err => console.log("ERROR GET MASTERS"));
}

const getMasterVotesById = (req, res) => {
  const {master_id} = req.userData

  master.findByPk(master_id)
    .then(result => {
      if (!result) return; 
      res.json(result);
    }).catch(err => console.log("ERROR GET VOTES"));
}

const createMaster = (req, res) => {
  const rules = {
    master_name: "required|max:20",
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {
      master_name,
      city,
    } = req.body;

    master.create({
      master_name: master_name,
      city: city
    })
      .then(() => console.log("MASTER WAS ADDED"))
      .catch(err => console.log("ERROR, MASTER WAS NOT ADDED"))
      .then(() => master.max('id'))
      .then(result => master.findOne({
        where: {
          id: result
        }
      }))
      .then(result => {
        res.send(result);
        user.create({
          id: result.id,
          username: result.master_name + result.id
        })
      })
      .catch(err => console.log("ERRORS WITH NEW MASTER", err))
  } else {
    console.log("ERROR MASTER POST")
  }
}

const deleteMaster = (req, res) => {
  const id = req.params.id;

  master.destroy({
    where: {
      id: id
    }
  })
    .then(() => user.destroy({
      where: {
        id: id
      }
    }))
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, MASTER WAS NOT DELETED"))
}

const updateMaster = (req, res) => {
  const rules = {
    master_name: "required|max:20",
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const id = req.params.id;
    const {
      master_name,
      city,
    } = req.body;

    master.update(
      {
        master_name: master_name,
        city: city
      },
      {
        where: {
          id: id
        }
      }
    )
      .then(result => res.json(result))
      .catch(err => console.log("ERROR, MASTER WAS NOT UPDATED"))
  } else {
    console.log("ERROR MASTER PUT")
  }
}

const setMasterPassword = (req, res) => {
  const rules = {
    password: "required|max:30",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const id = req.params.id;

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return console.log("ERROR")
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
          .catch(err => console.log("ERROR, MASTER PASSWORD"))
      }
    })
  } else {
    console.log("ERROR MASTER PASSWORD")
  }
}

const findMaster = (req, res) => {
  const {searchParam} = req.body
  master.findAll({
    where: {
      master_name: {[Op.startsWith]: searchParam}
    }
  })
  .then(result => {
    const mastersArray = result.map(master => `${master.master_name}, id:${master.id}`)
    res.send(mastersArray)
  })
  .catch(err => console.log("ERROR FIND MASTER", err))

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