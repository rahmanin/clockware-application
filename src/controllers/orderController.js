const order = require('../models/orders');
const user = require('../models/users');
const master = require('../models/masters');
const feedback = require('../models/feedbacks');
const sendEmail = require('../email/sendEmail.js');
const sendFeedbackEmailFunc = require('../email/sendFeedbackEmailFunc.js');
const sendEmailAdminReport = require('../email/sendEmailAdminReport.js');
const writeReportInfo = require ("../controllers/mail_report_infosController");
const today = require('../constants/todaysDate')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Op } = require("sequelize");
const Validator = require('validatorjs');
const cloudinary = require('cloudinary').v2;
const cron = require('node-cron');

const postImage = (req, res) => {
  const file = req.file;

  if (!file) res.status(500).send('ERROR!')

  cloudinary.uploader.upload(`${file.path}`, { tags: 'basic_sample' })
    .then(image => res.json(image.url))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR UPLOAD IMAGE", err)
    })
}

const timeStartArray = [
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]
const timeEndArray = [
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
]

const postOrder = (req, res) => {
  const rules = {
    username: "required|min:2|max:15",
    email: "required|max:35|email",
    size: "required|in:Small,Medium,Large",
    city: "required|max:20",
    order_date: "required|date",
    order_time_start: `required|in:${timeStartArray}`,
    order_time_end: `required|in:${timeEndArray}`,
    order_master: "required|max:20",
    order_price: "required|integer"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {
      username, 
      email, 
      size,
      city,
      order_date,
      order_time_start,
      order_time_end,
      order_master,
      order_price,
      master_id,
      image,
      id
    } = req.body;
    const loggedUser = req.userData
    order.create({
      client_id: loggedUser ? loggedUser.userId : id,
      size: size,
      city: city,
      order_date: order_date,
      order_master: order_master,
      order_price: order_price,
      master_id: master_id,
      order_time_start: order_time_start,
      order_time_end: order_time_end,
      image: image
    })
    .then(() => {
      const token = jwt.sign(
        {
          email: email, 
          userId: id,
          username: username,
          registration: true
        }, 
        process.env.SECRETKEY, 
        {
          expiresIn: '10d'
        }
      );
      const url = `http://localhost:3000/login?token=${token}`
      if (!loggedUser) {
        sendEmail.sendEmailUnregisteredUser(
          username, 
          email, 
          size, 
          city, 
          order_date, 
          order_master, 
          order_price, 
          order_time_start,
          url
        )
      } else {
        sendEmail.sendEmailRegisteredUser(username, email)
      }
    })
    .then(() => res.send({msg: 'Yor order was formed and sent by email! Thank you for choosing CLOCKWARE'}))
    .catch(() => {
      console.log("ORDER ERROR")
      res.sendStatus(500)
    })
  } else {
    console.log("ERROR POST ORDER")
    res.sendStatus(400)
  }
}

const getOrdersByCityByDate = (req, res) => {
  const rules = {
    city: "required|max:20",
    order_date: "required|date",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {
      city,
      order_date
    } = req.body;

    order.findAll({
      where : {
        city: city,
        order_date: order_date,
      }
    })
      .then(result => res.json(result))
      .catch(err => {
        res.sendStatus(500)
        console.log("error")
      });
  } else {
    res.sendStatus(400)
    console.log("ERROR GET ORDERS BY DATE")
  }
}

const finishOrder = (req, res) => {
  const rules = {
    feedback_master: "max:100",
    additional_price: "integer",
    is_done: "required|boolean"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()  && req.userData.role === "master") {
    const order_id = req.params.id;
    const {
      feedback_master,
      additional_price,
      is_done,
      email
    } = req.body;
    const master_id = req.userData.userId
    
    const token = jwt.sign(
      {
        order_id: order_id,
        master_id: master_id
      }, 
      process.env.SECRETKEY, 
      {
        expiresIn: '1d'
      }
    );

    order.update(
      {
        feedback_master: feedback_master,
        additional_price: additional_price,
        is_done: is_done
      },
      {
        where: {
          order_id: order_id,
          master_id: master_id
        }
      }
    )
      .then(result => res.json(result))
      .catch(err => {
        res.sendStatus(500)
        console.log("ERROR, ORDER WAS NOT UPDATED", err)
      })
      .then(() => order.findOne(
        {
          where: {
            order_id: order_id
          },
          attributes: [
            'size', 
            'city', 
            'order_date', 
            'order_time_start', 
            'order_master', 
            'feedback_master', 
            'order_price', 
            'additional_price'
          ]
        }
      ))
      .then(result => {
        sendFeedbackEmailFunc(
          email,
          `https://clockware-app.herokuapp.com/feedback?token=${token}&order=${JSON.stringify(result)}`
        )
      })
      .catch(err => {
        res.sendStatus(500)
        console.log("SOME ERRORS WHEN FINISHING ORDER", err)
      })
  } else {
    res.sendStatus(400)
    console.log("FINISH ORDER PARAMS ERROR")
  }
}

const sendFeedback = (req, res) => {
  const rules = {
    feedback_client: "max:100",
    evaluation: "required|min:1|max:5|integer",
    rating: "required|min:1|max:5",
    votes: "required|integer"
  }

  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {
      order_id,
      master_id
    } = req.userData;

    const {
      feedback_client,
      evaluation,
      votes,
      rating
    } = req.body;
    
    feedback.findOne(
      {
        where: {
          order_id: order_id
        }
      }
    )
      .then(result => {
        if (!result) {
          feedback.create(
            {
              evaluation: evaluation,
              feedback: feedback_client,
              master_id: master_id,
              order_id: order_id,
              createdAt: new Date()
            }
          )
          .then(() => order.update(
            {
              feedback_client_id: order_id
            },
            {
              where: {
                order_id: order_id
              }
            }
          ))
          .then(() => master.update(
            {
              votes: votes,
              rating: rating
            },
            {
              where: {
                id: master_id
              }
            }
          ))
          .then(() => res.send({msg: "Thank You for your feedback!"}))
          .catch(error => {
            res.sendStatus(500)
            console.log("CLIENT FEEDBACK - ERROR", error)
          })
        } else {
          console.log("FEEDBACK WAS WRITTEN")
          res.send({err_msg: "Feedback was already written"})
        }
      })
  } else {
    res.sendStatus(400)
    console.log("FEEDBACK PARAMS ERROR")
  }
}

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalOrders, rows: orders } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalOrders / limit);
  return { totalOrders, orders, totalPages, currentPage };
};

const getOrdersPagination = (req, res) => {
  const rules = { 
    page: "integer",
    size: "integer",
    city: "max:20",
    master_params: "string",
    order_date_start: "date",
    order_date_end: "date",
    sortBy: {
      order_date: "boolean",
      order_master: "boolean",
      size: "boolean",
      city: "boolean",
    },
    show_all: "boolean",
  } 
  
  const validation = new Validator(req.body, rules);
  if (validation.passes()) {
    const { 
      page,
      size,
      city,
      master_params,
      order_date_start,
      order_date_end,
      sortBy,
      show_all,
    } = req.body;
    const loggedUser = req.userData
    const { limit, offset } = getPagination(page, size);

    const getOrders = (column, sortParam) => {
      order.findAndCountAll({
        where: {
          city: city || { [Op.not]: null },
          order_date: order_date_start ? {[Op.between]: [order_date_start, order_date_end]} : { [Op.not]: null },
          master_id: master_params ?  master_params.split(":")[1] : { [Op.not]: null},
          is_done: show_all ? ['true', 'false'] : false,
          client_id: loggedUser.role === "client" ? loggedUser.userId : { [Op.not]: null }
        },
        include: [{
          model: user,
          attributes: ["username", "email"]
        },
        {
          model: feedback
        }],
        order: [
          sortParam ? [column, 'ASC']
          : 
          [column, 'DESC']
        ],
        limit,
        offset
      })
      .then(result => {
        const response = getPagingData(result, page, limit);
        res.send(response)
      })
      .catch(err => console.log("ERROR ORDERS FILTER/SORT", err))
    }

    getOrders(Object.keys(sortBy)[0], Object.values(sortBy)[0])

  } else {
    console.log("ERROR VALIDATION ORDERS")
  }
}

const deleteOrder = (req, res) => {
  const id = req.params.id;

  req.userData.role === "admin" && order.destroy({
    where: {
      order_id: id
    }
  })
    .then(result => res.json(result))
    .catch(err => {
      res.sendStatus(401)
      console.log("ERROR, ORDER WAS NOT DELETED", err)
    })
}

const updateOrder = (req, res) => {
  const rules = {
    size: "required|in:Small,Medium,Large",
    city: "required|max:20",
    order_date: "required|date",
    order_time_start: `required|in:${timeStartArray}`,
    order_time_end: `required|in:${timeEndArray}`,
    order_master: "required|max:20",
    master_id: 'integer'
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const {
      order_date,
      city,
      size,
      order_time_end,
      order_date_start,
      order_master,
      master_id,
      order_price
    } = req.body;

    order.update(
      {
        order_date: order_date,
        city: city,
        size: size,
        order_time_end: order_time_end,
        order_date_start: order_date_start,
        order_master: order_master,
        master_id: master_id,
        order_price: order_price
      },
      {
        where: {
          order_id: id
        }
      }
    )
      .then(result => res.json(result))
      .catch(err => {
        res.sendStatus(500)
        console.log("ERROR, MASTER WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR MASTER PUT")
  }
}

const getOrdersDiagramInfo = (req, res) => {
  const rules = { 
    city: "array",
    master_params: "array",
    order_date_start: "date",
    order_date_end: "date",
  } 

  const validation = new Validator(req.body, rules);
  if (validation.passes() && req.userData.role === "admin") {
    const { 
      city,
      master_params,
      order_date_start,
      order_date_end,
    } = req.body;

    order.findAll({
      where: {
        city: city.length ? { [Op.in]: city } : { [Op.not]: null },
        order_date: order_date_start ? {[Op.between]: [order_date_start, order_date_end]} : { [Op.not]: null },
        master_id: master_params.length ? { [Op.in]: master_params } : { [Op.not]: null },
      },
      order: [
        ['order_date', 'ASC']
      ],
    })
    .then(result => res.send(result))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR ORDERS FOR DIAGRAM", err)
    })
  } else {
    res.sendStatus(400)
    console.log("ERROR VALIDATION FOR DIAGRAM")
  }
}

const cronAdminReport = cron.schedule('0 13 * * *', () => {
  order.findAndCountAll({
    where: {
      is_done: false,
      order_date: {[Op.lt]: today}
    }
  })
  .then(res => sendEmailAdminReport(res.count))
  .catch(err => {
    console.log("ERROR CRON TASK")
    writeReportInfo(false)
  })
}, {
  scheduled: false
});

cronAdminReport.start()

module.exports = {
  postOrder,
  getOrdersByCityByDate,
  finishOrder,
  sendFeedback,
  getOrdersPagination,
  postImage,
  deleteOrder,
  updateOrder,
  getOrdersDiagramInfo
}