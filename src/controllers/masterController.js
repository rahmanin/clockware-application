const master = require('../models/masters');
const isValid = require('../middlewares/validation.js');
const { Sequelize } = require('sequelize');

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
      res.json(result.votes);
    }).catch(err => console.log("ERROR GET VOTES"));
}

const createMaster = (req, res) => {
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
    .then(() => master.findAll({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'MAX_ID']]
    }))
    .then(result => master.findAll({
      where: {
        id: result
      }
    }))
    .then(result => {
      console.log(result)
    })
    .catch(err => console.log("ERRORS WITH NEW MASTER", err))
}

module.exports = {
  getMasters,
  getMasterVotesById,
  createMaster
}