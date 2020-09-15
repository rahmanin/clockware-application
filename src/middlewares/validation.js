const { body } = require('express-validator');

const isValid = action => {
  switch (action) {
    case 'postOrder': {
      return  [ 
        body('client_name').exists().isLength({ min: 2 , max: 15}),
        body('client_email').exists().isEmail().isLength({max: 35}),
        body('size').exists().custom(value => value === "Small" || value === "Medium" || value === "Large"),
        body('city').exists().isLength({max: 20}),
        body('order_date').exists().isISO8601(),
        body('order_time_start').exists().matches('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'),
        body('order_time_end').exists().matches('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'),
        body('order_master').exists().isLength({max: 20}),
        body('order_price').exists().isInt()
      ]
    }
    case 'logIn': {
      return  [ 
        body('username').exists().isLength({max: 35}),
        body('password').exists().isLength({max: 30}),
      ]
    }
    case 'masterPostPut': {
      return  [ 
        body('master_name').exists().isLength({max: 20}),
        body('city').exists().isLength({max: 20}),
      ]
    }
    case 'cityPostPut': {
      return  [ 
        body('city').exists().isLength({max: 20}),
      ]
    }
    case 'pricesPut': {
      return  [ 
        body('price').exists().isInt(),
      ]
    }
    case 'masterPass': {
      return  [ 
        body('password').exists().isLength({max: 30}),
      ]
    }
    case 'orderPut': {
      return  [ 
        body('feedback_master').isLength({max: 100}),
        body('additional_price').isInt(),
        body('feedback_client').isLength({max: 100}),
        body('is_done').exists().isBoolean()
      ]
    }
    case 'feedbackClient': {
      return  [ 
        body('feedback_client').isLength({max: 100}),
        body('evaluation').exists().isInt(),
        body('rating').exists().custom(value => value >= 1 && value <= 5),
        body('votes').exists().isInt(),
      ]
    }
    case 'orders_by_city': {
      return  [ 
        body('city').exists().isLength({max: 20}),
        body('order_date').exists().isISO8601(),
      ]
    }
  }
}

module.exports = isValid;