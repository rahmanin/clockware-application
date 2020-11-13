const city = require('../models/cities');
const Validator = require('validatorjs');

const getCities = (req, res) => {
  city.findAll()
    .then(cities => res.json(cities))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR GET CITIES")
    });
}

const createCity = (req, res) => {
  const rules = {
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const newCity = req.body.city;
    city.create({
      city: newCity
    })
      .then(() => console.log("CITY WAS ADDED"))
      .catch(err => {
        res.sendStatus(500)
        console.log("ERROR, CITY WAS NOT ADDED")
      })
      .then(() => city.max('id'))
      .then(result => city.findOne({
        where: {
          id: result
        }
      }))
      .then(result => res.send(result))
      .catch(err => {
        res.sendStatus(500)
        console.log("ERRORS WITH NEW CITY", err)
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR POST CITY")
  }
}

const deleteCity = (req, res) => {
  const id = req.params.id;

  req.userData.role === "admin" && city.destroy({
    where: {
      id: id
    }
  })
    .then(result => res.json(result))
    .catch(err => {
      res.sendStatus(401)
      console.log("ERROR, CITY WAS NOT DELETED")
    })
}

const updateCity = (req, res) => {
  const rules = {
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
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
      .catch(err => {
        res.sendStatus(500)
        console.log("ERROR, CITY WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR PUT CITY")
  }
}

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity
}