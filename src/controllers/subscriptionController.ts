import {Request, Response} from "express"
import subscription_settings, { SubscrSetting } from '../models/subscription_settings';
import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";

interface RequestWithUserData extends Request {
  userData?: {
    userId: number
  }
}

const createSubscriptionSettings = (req: RequestWithUserData, res: Response) => {
  const {
    subscription,
    token,
    endpoint
  } = req.body;
  const userId = req.userData.userId;

  subscription_settings.findOrCreate<SubscrSetting>({
    where: {
      endpoint: endpoint
    },
    defaults: {
      user_id: userId,
      subscription: JSON.stringify(subscription),
      user_token: token,
      endpoint: subscription.endpoint
    }
  })
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log("ERROR CREATE SUBSCRIPTION", err)
      res.sendStatus(500)
    })
}

const deleteSubscriptionSettings = (req: RequestWithUserData, res: Response) => {
  const {
    endpoint
  } = req.body;
  const userId = req.userData.userId;

  subscription_settings.destroy<SubscrSetting>({
    where: {
      endpoint: endpoint,
      user_id: userId
    }
  })
    .then(result => res.status(200).json(result))
    .catch(err => {
      console.log("ERROR DELETE SUBSCRIPTION", err)
      res.sendStatus(500)
    })
}

const tokenIsInvalid = (token: string) => {
  return jwt.verify(
    token,
    process.env.SECRETKEY,
    (err, decoded) => {
      if (err) {
        return true
      } else {
        return false
      }
    }
  );
}

cron.schedule('0 */1 * * *', () => {
  subscription_settings.findAll<SubscrSetting>()
    .then(result => {
      const subscriptionsWithInvalidToken = result.filter(e => tokenIsInvalid(e.user_token))
      const arrayOfIds = subscriptionsWithInvalidToken.map(e => e.id)
      subscription_settings.destroy<SubscrSetting>({
        where: {
          id: { [Op.in]: arrayOfIds }
        }
      })
        .then(() => console.log("INVALID SUBSCRS DELETED"))
        .catch(() => console.log("ERROR DELETE INVALID SUBSCRS"))
  })
    .catch(() => console.log("ERROR SUBSCRS CRON TASK"))
})

export default {
  createSubscriptionSettings,
  deleteSubscriptionSettings
}