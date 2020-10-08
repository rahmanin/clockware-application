const size = require('../models/sizes');

const getSizes = (req, res) => {
  size.findAll()
    .then(sizes => res.json(sizes))
    .catch(err=>console.log("ERROR GET CITIES"));
}

const updatePrice = (req, res) => {
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
    .catch(err => console.log("ERROR, PRICE WAS NOT UPDATED"))
}

module.exports = {
  getSizes,
  updatePrice
}