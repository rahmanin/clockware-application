const express = require('express');
require('dotenv').config();
 
const getAccess = require('../middlewares/getAccess.js');

const cityController = require('../controllers/cityController');
const masterController = require('../controllers/masterController');
const sizeController = require('../controllers/sizeController');
const logInController = require('../controllers/logInController');
const orderController = require('../controllers/orderController');
const feedbackController = require('../controllers/feedbackController');

const clientRouter = express.Router();

clientRouter.get('/api/cities', cityController.getCities)

clientRouter.get('/api/masters', masterController.getMasters)

clientRouter.get('/api/size', sizeController.getSizes)

clientRouter.get('/api/select_master_votes', getAccess, masterController.getMasterVotesById)

clientRouter.post('/api/login', logInController.logIn)

clientRouter.post('/api/orders', orderController.postOrder)

clientRouter.post('/api/orders_by_city', orderController.getOrdersByCityByDate)

clientRouter.post('/api/feedback', getAccess, orderController.sendFeedback)

clientRouter.post("/api/feedbacks_by_master_id", feedbackController.feedbacksByMasterId)

module.exports = clientRouter;
