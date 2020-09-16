const master = require('../models/masters');

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
      console.log(result.votes);
    }).catch(err => console.log("ERROR GET VOTES"));
}

module.exports = {
  getMasters,
  getMasterVotesById
}