import express from 'express';
import getAccess from '../middlewares/getAccess';
import cityController from '../controllers/cityController';
import masterController from '../controllers/masterController';
import sizeController from '../controllers/sizeController';
import logInController from '../controllers/logInController';
import orderController from '../controllers/orderController';

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

adminRouter.put("/api/update_order/:id", getAccess, orderController.updateOrder)

adminRouter.post('/api/check_token', getAccess, logInController.checkToken)

adminRouter.post('/api/orders_filter_sort', getAccess, orderController.getOrdersPagination)

adminRouter.delete("/api/orders/:id", getAccess, orderController.deleteOrder)

adminRouter.post('/api/find_master', getAccess, masterController.findMaster)

adminRouter.post('/api/orders_diagram', getAccess, orderController.getOrdersDiagramInfo)

export default adminRouter