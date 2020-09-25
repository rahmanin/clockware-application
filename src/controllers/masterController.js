const master = require('../models/masters');
const isValid = require('../middlewares/validation.js');

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

module.exports = {
  getMasters,
  getMasterVotesById
}