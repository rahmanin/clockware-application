const express = require('express');
require('dotenv').config();
const multer  = require("multer");
const upload = multer({
    dest:"uploads",
    limits: {
        fileSize: 1048576
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') 
        {
            return cb(null, false);
        } else {
            cb(null, true);
        }
    }
});

const getAccess = require('../middlewares/getAccess.js');

const cityController = require('../controllers/cityController');
const userController = require('../controllers/userController');
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

clientRouter.post('/api/check_user', userController.checkUser)

clientRouter.post('/api/user_set_password', getAccess, userController.userSetPassword)

clientRouter.post('/api/login', logInController.logIn)

clientRouter.post('/api/orders_unregistered_client', orderController.postOrder)

clientRouter.post('/api/orders_logged_client', getAccess, orderController.postOrder)

clientRouter.post('/api/send_image', upload.single("file"), orderController.postImage)

clientRouter.post('/api/orders_by_city', orderController.getOrdersByCityByDate)

clientRouter.post('/api/feedback', getAccess, orderController.sendFeedback)

clientRouter.post("/api/feedbacks_by_master_id", feedbackController.feedbacksByMasterId)

module.exports = clientRouter;
