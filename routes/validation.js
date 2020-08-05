const { body } = require('express-validator');

const isValid = action => {
  switch (action) {
    case 'postOrder': {
      return  [ 
        body('client_name').exists(),
        body('client_email').exists().isEmail(),
        body('size').exists(),
        body('city').exists(),
        body('order_date').exists().isISO8601(),
        body('order_time').exists().isISO8601(),
        body('order_master').exists(),
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
        body('master_name').exists(),
        body('city').exists(),
        body('rating').exists(),
      ]
    }
    case 'cityPostPut': {
      return  [ 
        body('city').exists()
      ]
    }
  }
}

module.exports = isValid;