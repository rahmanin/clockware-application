import paypal from "paypal-rest-sdk"
import {Request, Response} from "express"
import order, { Order } from '../models/orders';

require('dotenv').config();

interface RequestWithUserData extends Request {
  userData?: {
    role: string,
    master_id: number
  }
}

paypal.configure({
  'mode': 'sandbox', 
  'client_id': process.env.PAYPAL_CLIENT_ID, 
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

const createPay = (payment: paypal.Payment) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, (err, payment) => {
      if (err) {
        reject(err); 
      }
      else {
        resolve(payment); 
      }
    }); 
  });
}		

const paypalFunction = async(req: RequestWithUserData, res: Response) => {
  const targetOrder = await order.findOne<Order>({
    where: {
      order_id: req.params.id
    }
  })
  const totalPrice = targetOrder.order_price + targetOrder.additional_price
  const payment: paypal.Payment = {
    "intent": "authorize",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": `https://clockware-app.herokuapp.com/api/payment/success/${req.params.id}`,
      "cancel_url": "https://clockware-app.herokuapp.com/api/payment/err"
    },
    "transactions": [
      {
        "amount": {
          "total": `${totalPrice}`,
          "currency": "USD"
        },
        "description": "desc"
      }
    ]
  }

  return createPay(payment) 
    .then((transaction: any) => {
      var id = transaction.id; 
      var links = transaction.links;
      links.map((link: any) => link.method === 'REDIRECT' && res.send({payLink: link.href}))
    })
    .catch(err => { 
      console.log("ERROR PAYPAL", err); 
      res.sendStatus(500);
    });
}	

const paypalSuccess = (req: Request, res: Response) => {
  console.log(req.params)
  var paymentId: any = req.query.paymentId;
  var payerId: any = {'payer_id': req.query.PayerID};
  paypal.payment.execute(paymentId, payerId, (error, payment) => {
    if (error) {
      console.error(error);
    } else if (payment.state == 'approved') { 
      order.update<Order>(
        {
          isPaid: true
        },
        {
          where: {
            order_id: req.params.id
          }
        }
      )
        .then(() => res.redirect('https://clockware-app.herokuapp.com/orders?msg="Payment%20Success'))
        .catch(() => {
          console.log("ORDER WASNT MARKED AS PAID")
          res.sendStatus(500)
        })
    } else {
      res.send({msg: 'Payment was not success'});
    }
  });
}

export default {
  paypalFunction,
  paypalSuccess
}