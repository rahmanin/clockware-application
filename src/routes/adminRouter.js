const express = require('express');

const getAccess = require('../middlewares/getAccess.js');

const cityController = require('../controllers/cityController');
const masterController = require('../controllers/masterController');
const sizeController = require('../controllers/sizeController');
const logInController = require('../controllers/logInController');
const orderController = require('../controllers/orderController');

const adminRouter = express.Router();

adminRouter.post('/api/masters', getAccess, masterController.createMaster)

adminRouter.delete("/api/masters/:id", getAccess, masterController.deleteMaster)

adminRouter.put("/api/masters/:id", getAccess, masterController.updateMaster)

adminRouter.put("/api/masterPass/:id", getAccess, masterController.setMasterPassword)

adminRouter.post('/api/cities', getAccess, cityController.createCity)

adminRouter.delete("/api/cities/:id", getAccess, cityController.deleteCity)

adminRouter.put("/api/cities/:id", getAccess, cityController.updateCity)

adminRouter.put("/api/prices/:id", getAccess, sizeController.updatePrice)

adminRouter.put("/api/orders/:id", getAccess, orderController.finishOrder)

adminRouter.post('/api/check_token', getAccess, logInController.checkToken)

module.exports = adminRouter;