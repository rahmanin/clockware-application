const city = require('../models/cities');

const getCities = (req, res) => {
  city.findAll()
    .then(cities => res.json(cities))
    .catch(err=>console.log("ERROR GET CITIES"));
}

module.exports = {
  getCities
}