import order, { Order } from '../models/orders';
import user from '../models/users';
import master, { Master } from '../models/masters';
import {Request, Response} from "express"
import { Op } from "sequelize";
import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import Validator from 'validatorjs';
import today from '../constants/todaysDate';
import writeReportInfo from "../controllers/mail_report_infosController";
import feedback from '../models/feedbacks';
import cloudinary from 'cloudinary';
import sendEmail from '../email/sendEmail';
import sendFeedbackEmailFunc from '../email/sendFeedbackEmailFunc';
import sendEmailAdminReport from '../email/sendEmailAdminReport';
import { google } from 'googleapis';
import googleController from "../google/google"
import subscription_settings, { SubscrSetting } from '../models/subscription_settings';
import webpush from 'web-push';

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)
require('dotenv').config();

interface RequestWithUserData extends Request {
  userData?: {
    role: string,
    userId: number,
    order_id?: number,
    master_id?: number
  },
  file: any,
}

const postImage = (req: RequestWithUserData, res: Response) => {
  const file = req.file;
  if (!file) res.status(500).send('ERROR!')

  cloudinary.v2.uploader.upload(`${file.path}`, { tags: 'basic_sample' })
    .then((image: any) => res.json(image.url))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR UPLOAD IMAGE", err)
    })
}

const timeStartArray: Array<string> = [
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
const timeEndArray: Array<string> = [
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

const postOrder = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    username: "required|min:2|max:35",
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
      id,
      address
    } = req.body;
    const loggedUser = req.userData
    order.create<Order>({
      client_id: loggedUser ? loggedUser.userId : id,
      size: size,
      city: city,
      order_date: order_date,
      order_master: order_master,
      order_price: order_price,
      master_id: master_id,
      order_time_start: order_time_start,
      order_time_end: order_time_end,
      image: image,
      address: address
    })
    .then(async(result) => {
      const auth = await googleController.googleAuthenticate()
      google.calendar('v3').events.insert({
        auth: auth,
        calendarId: googleController.CALENDAR_ID,
        requestBody: {
          summary: `${result.order_id}`,
          location: `${city}`,
          description: `Master: ${order_master}, client: ${email}, size: ${size}`,
          start: {
            'dateTime': `${order_date}T${order_time_start[0]>2 ? "0"+order_time_start : order_time_start}:00+02:00`,
            'timeZone': 'Europe/Kiev',
          },
          end: {
            'dateTime': `${order_date}T${order_time_end[0]>2 ? "0"+order_time_end : order_time_end}:00+02:00`,
            'timeZone': 'Europe/Kiev',
          },
        },
      })
    })
    .catch(() => console.log("ERROR ADD EVENT TO CALENDAR"))
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
      const url = `${process.env.CLIENT_URL}/login?token=${token}`
      if (!loggedUser) {
        return sendEmail.sendEmailUnregisteredUser(
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
        return sendEmail.sendEmailRegisteredUser(username, email)
      }
    })
    .then(() => res.send({msg: 'Yor order was formed and sent by email! Thank you for choosing CLOCKWARE'}))
    .catch(() => {
      console.log("ORDER ERROR")
      res.sendStatus(500)
    })
    .then(() => {
      const payload = JSON.stringify({
        title: 'CLOCKWARE APP',
        body: `New order created in ${city}, date: ${order_date}`,
      })
      subscription_settings.findAll<SubscrSetting>({
        include: [{
          model: user,
          attributes: ["role"]
        }],
      })
        .then(result => {
          const andminSubscriptions = result.filter((e: any) => e.user.role==="admin")
          andminSubscriptions.map(subscr => {
            return webpush.sendNotification(JSON.parse(subscr.subscription), payload)
              .then(result => console.log("NOTIFICATION SUCCESS"))
              .catch(e => console.log(e.stack))
          })
        })
    })
  } else {
    console.log("ERROR POST ORDER")
    res.sendStatus(400)
  }
}

const getOrdersByCityByDate = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    city: "required|max:20",
    order_date: "date",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {
      city,
      order_date,
      master_id
    } = req.body;

    order.findAll<Order>({
      where : {
        city: city,
        order_date: order_date || { [Op.not]: null},
        master_id: master_id || { [Op.not]: null}
      }
    })
      .then(result => res.json(result))
      .catch(() => {
        res.sendStatus(500)
        console.log("error")
      });
  } else {
    res.sendStatus(400)
    console.log("ERROR GET ORDERS BY DATE")
  }
}

const finishOrder = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
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

    order.update<Order>(
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
      .catch(() => {
        res.sendStatus(500)
        console.log("ERROR, ORDER WAS NOT UPDATED")
      })
      .then(() => order.findOne<Order>(
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
        return sendFeedbackEmailFunc(
          email,
          `${process.env.CLIENT_URL}/feedback?token=${token}&order=${JSON.stringify(result)}`
        )
      })
      .then(() => res.sendStatus(200))
      .catch(() => {
        res.sendStatus(500)
        console.log("SOME ERRORS WHEN FINISHING ORDER")
      })
  } else {
    res.sendStatus(400)
    console.log("FINISH ORDER PARAMS ERROR")
  }
}

const sendFeedback = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
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
      .then((result: any) => {
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
          .then(() => order.update<Order>(
            {
              feedback_client_id: order_id
            },
            {
              where: {
                order_id: order_id
              }
            }
          ))
          .then(() => master.update<Master>(
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
          .catch(() => {
            res.sendStatus(500)
            console.log("CLIENT FEEDBACK - ERROR")
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

const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data: {count: number, rows: Order[]}, page: number, limit: number) => {
  const { count: totalOrders, rows: orders } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalOrders / limit);
  return { totalOrders, orders, totalPages, currentPage };
};

const getOrdersPagination = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string | {[key: string]: string}} = { 
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

    const getOrders = (column: string, sortParam: any) => {
      order.findAndCountAll<Order>({
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
      .catch(() => console.log("ERROR ORDERS FILTER/SORT"))
    }

    getOrders(Object.keys(sortBy)[0], Object.values(sortBy)[0])

  } else {
    console.log("ERROR VALIDATION ORDERS")
  }
}

const deleteOrder = (req: RequestWithUserData, res: Response) => {
  const id = req.params.id;

  req.userData.role === "admin" && order.destroy({
    where: {
      order_id: id
    }
  })
    .then(async result => {
      const auth = await googleController.googleAuthenticate()
      const eventId = await googleController.getEventIdByOrderId(Number(id), auth)
      await google.calendar('v3').events.delete({
        auth: auth,
        calendarId: googleController.CALENDAR_ID,
        eventId: eventId
      })
      res.json(result)
    })
    .catch(() => {
      res.sendStatus(401)
      console.log("ERROR, ORDER WAS NOT DELETED")
    })
}

const updateOrder = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    size: "required|in:Small,Medium,Large",
    city: "required|max:20",
    order_date: "required|date",
    order_time_start: `required|in:${timeStartArray}`,
    order_time_end: `required|in:${timeEndArray}`,
    order_master: "required|max:20",
    master_id: 'integer',
    email: "required|max:35|email"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const {
      order_date,
      city,
      size,
      order_time_end,
      order_time_start,
      order_master,
      order_price,
      email
    } = req.body;

    order.update<Order>(
      {
        order_date: order_date,
        size: size,
        order_time_end: order_time_end,
        order_time_start: order_time_start,
        order_price: order_price
      },
      {
        where: {
          order_id: id
        }
      }
    )
      .then(async(result) => {
        const auth = await googleController.googleAuthenticate()
        const eventId = await googleController.getEventIdByOrderId(Number(id), auth)
        await google.calendar('v3').events.update({
          auth: auth,
          calendarId: googleController.CALENDAR_ID,
          eventId: eventId,
          requestBody: {
            summary: `${id}`,
            location: `${city}`,
            description: `Master: ${order_master}, client: ${email}, size: ${size}`,
            start: {
              'dateTime': `${order_date}T${order_time_start[0]>2 ? "0"+order_time_start : order_time_start}:00+02:00`,
              'timeZone': 'Europe/Kiev',
            },
            end: {
              'dateTime': `${order_date}T${order_time_end[0]>2 ? "0"+order_time_end : order_time_end}:00+02:00`,
              'timeZone': 'Europe/Kiev',
            },
          }
        })
        res.json(result)
      })
      .catch((e) => {
        res.sendStatus(500)
        console.log("ERROR, ORDER WAS NOT UPDATED",e)
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR ORDER PUT")
  }
}

const getOrdersDiagramInfo = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = { 
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

    order.findAll<Order>({
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
    .catch(() => {
      res.sendStatus(500)
      console.log("ERROR ORDERS FOR DIAGRAM")
    })
  } else {
    res.sendStatus(400)
    console.log("ERROR VALIDATION FOR DIAGRAM")
  }
}

const cronAdminReport = cron.schedule('0 13 * * *', () => {
  order.findAndCountAll<Order>({
    where: {
      is_done: false,
      order_date: {[Op.lt]: today}
    }
  })
  .then(res => sendEmailAdminReport(res.count))
  .catch(() => {
    console.log("ERROR CRON TASK")
    writeReportInfo(false)
  })
}, {
  scheduled: false
});

cronAdminReport.start()

export default {
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