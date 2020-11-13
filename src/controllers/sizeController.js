const size = require('../models/sizes');
const Validator = require("validatorjs");

const getSizes = (req, res) => {
  size.findAll()
    .then(sizes => res.json(sizes))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR GET CITIES")
    });
}

const updatePrice = (req, res) => {
  const rules = {
    price: "required|integer"
  }
  const validator = new Validator(req.body, rules)
  if (validator.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const updatedPrice = req.body.price;

    size.update(
      {
        price: updatedPrice
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
        console.log("ERROR, PRICE WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR PRICE PARAMS")
  }
}

module.exports = {
  getSizes,
  updatePrice
}