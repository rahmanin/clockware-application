const city = require('../models/cities');
const Validator = require('validatorjs');

const getCities = (req, res) => {
  city.findAll()
    .then(cities => res.json(cities))
    .catch(err=>console.log("ERROR GET CITIES"));
}

const createCity = (req, res) => {
  const rules = {
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
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
  } else {
    console.log("ERROR POST CITY")
  }
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
  const rules = {
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
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
  } else {
    console.log("ERROR PUT CITY")
  }
}

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity
}