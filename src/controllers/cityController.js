const city = require('../models/cities');

const getCities = (req, res) => {
  city.findAll()
    .then(cities => res.json(cities))
    .catch(err=>console.log("ERROR GET CITIES"));
}

const createCity = (req, res) => {
  const newCity = req.body.city;

  city.create({
    city: newCity
  })
    .then(() => console.log("CITY WAS ADDED"))
    .catch(err => console.log("ERROR, CITY WAS NOT ADDED"))
    .then(() => city.max('id'))
    .then(result => city.findOne({
      where: {
        id: result
      }
    }))
    .then(result => res.send(result))
    .catch(err => console.log("ERRORS WITH NEW CITY", err))
}

const deleteCity = (req, res) => {
  const id = req.params.id;

  city.destroy({
    where: {
      id: id
    }
  })
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT DELETED"))
}

const updateCity = (req, res) => {
  const id = req.params.id;
  const updatedCity = req.body.city;

  city.update(
    {
      city: updatedCity
    },
    {
      where: {
        id: id
      }
    }
  )
    .then(result => res.json(result))
    .catch(err => console.log("ERROR, CITY WAS NOT UPDATED"))
}

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity
}