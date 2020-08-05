const { body } = require('express-validator');

const isValid = action => {
  switch (action) {
    case 'order': {
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
  }
}

module.exports = isValid;