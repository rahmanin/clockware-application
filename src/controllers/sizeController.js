const size = require('../models/sizes');

const getSizes = (req, res) => {
  size.findAll()
    .then(sizes => res.json(sizes))
    .catch(err=>console.log("ERROR GET CITIES"));
}

module.exports = {
  getSizes
}