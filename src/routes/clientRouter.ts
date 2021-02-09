import {Request, Response} from 'express';
import express from 'express';
import multer from "multer";
import getAccess from '../middlewares/getAccess';
import getAccessFacebook from '../middlewares/getAccessFacebook';
import getAccessGoogle from '../middlewares/getAccessGoogle';
import cityController from '../controllers/cityController';
import userController from '../controllers/userController';
import masterController from '../controllers/masterController';
import sizeController from '../controllers/sizeController';
import logInController from '../controllers/logInController';
import orderController from '../controllers/orderController';
import feedbackController from '../controllers/feedbackController';
import paypalController from '../paypal/paypal';
import newsController from '../controllers/newsController';
import fetch from 'node-fetch';

require('dotenv').config();

const upload = multer({
  dest:"uploads",
  limits: {
    fileSize: 1048576
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') 
      {
        return cb(null, false);
      } else {
        cb(null, true);
      }
  }
});

const clientRouter = express.Router();

clientRouter.get('/api/cities', cityController.getCities)

clientRouter.get('/api/masters', masterController.getMasters)

clientRouter.get('/api/size', sizeController.getSizes)

clientRouter.get('/api/select_master_votes', getAccess, masterController.getMasterVotesById)

clientRouter.post('/api/check_user', userController.checkUser)

clientRouter.post('/api/user_set_password', getAccess, userController.userSetPassword)

clientRouter.post('/api/login', logInController.logIn)

clientRouter.post('/api/googleLogin', getAccessGoogle, logInController.googleFacebookLogIn)

clientRouter.post('/api/facebookLogin', getAccessFacebook, logInController.googleFacebookLogIn)

clientRouter.post('/api/orders_unregistered_client', orderController.postOrder)

clientRouter.post('/api/orders_logged_client', getAccess, orderController.postOrder)

clientRouter.post('/api/send_image', upload.single("file"), orderController.postImage)

clientRouter.post('/api/orders_by_city', orderController.getOrdersByCityByDate)

clientRouter.post('/api/feedback', getAccess, orderController.sendFeedback)

clientRouter.post("/api/feedbacks_by_master_id", feedbackController.feedbacksByMasterId)

clientRouter.post("/api/feedbacks_pagination", feedbackController.feedbacksPagination)

clientRouter.get('/api/pay/:id', paypalController.paypalFunction)

clientRouter.get('/api/payment/success/:id', paypalController.paypalSuccess)

clientRouter.post("/api/news_pagination", newsController.getNewsPagination)

clientRouter.post("/api/reset_password", userController.sendEmailToResetPassword)

clientRouter.post("/api/get_place_by_id", (req: Request, res: Response) => {
  fetch(`https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_MAPS_API_KEY}&placeid=${req.body.place_id}`)
    .then(result => result.json())
    .then(place => res.json(place))
    .catch(err => console.log(err))
})

export default clientRouter