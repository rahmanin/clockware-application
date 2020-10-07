const express = require('express');
require('dotenv').config();
 
const getAccess = require('../middlewares/getAccess.js');

const cityController = require('../controllers/cityController');
const masterController = require('../controllers/masterController');
const sizeController = require('../controllers/sizeController');
const logInController = require('../controllers/logInController');
const orderController = require('../controllers/orderController');


const clientRouter = express.Router();

clientRouter.get('/api/cities', cityController.getCities)

clientRouter.get('/api/masters', masterController.getMasters)

clientRouter.get('/api/size', sizeController.getSizes)

clientRouter.get('/api/select_master_votes', getAccess, masterController.getMasterVotesById)

clientRouter.post('/api/login', logInController.logIn)

clientRouter.get('/api/orders', orderController.getOrders)

clientRouter.post('/api/orders', orderController.postOrder)

clientRouter.post('/api/orders_by_city', orderController.getOrdersByCityByDate)

// clientRouter.post('/api/feedback', getAccess, isValid("feedbackClient"), (req, res) => {
//   const errors = validationResult(req); 

//   if (!errors.isEmpty()) {
//     return res.status(422).send(errors);
//   } else {

//     const {
//       order_id,
//       master_id
//     } = req.userData;

//     const {
//       feedback_client,
//       evaluation,
//       votes,
//       rating
//     } = req.body;

//     const sqlUpdateOrder = "UPDATE orders SET feedback_client=$1, evaluation=$2 WHERE order_id=$3"
//     const sqlCheckOrderIsDone = "SELECT evaluation FROM orders WHERE order_id=$1";
//     const sqlUpdateMaster = "UPDATE masters SET votes=$1, rating=$2 WHERE id=$3"

//     const updateOrder = [
//       feedback_client,
//       evaluation, 
//       order_id, 
//     ];

//     const updateMaster = [
//       votes,
//       rating,
//       master_id
//     ];

//     db.query(sqlCheckOrderIsDone, [order_id])
//       .then(result => {
//         if (result[0].evaluation === null) {
//           db.query(sqlUpdateOrder, updateOrder)
//             .then(db.query(sqlUpdateMaster, updateMaster))
//             .then(() => res.send({msg: "Thank You for your feedback!"}))
//             .catch(error => {
//               console.log("CLIENT FEEDBACK - ERROR", error)
//             })
//         } else {
//           res.send({err_msg: "Feedback was already written"})
//         }
//       })
//   }
// })

module.exports = clientRouter;
