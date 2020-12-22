import {Request, Response} from "express"
import subscription_settings, { SubscrSetting } from '../models/subscription_settings';
import Validator from 'validatorjs';

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

export default {
  createSubscriptionSettings,
  deleteSubscriptionSettings
}