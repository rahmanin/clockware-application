import {Request, Response} from 'express';
import fetch from 'node-fetch';

interface RequestWithUserData extends Request {
  userData?: Object
}

const getAccessFacebook = async(req: RequestWithUserData, res: Response, next: () => void) => {
  try {
    const result = await fetch(`https://graph.facebook.com/me?access_token=${req.body.accessToken}`)
    const userData = await result.json()
    req.userData = {
      email: req.body.email,
      name: userData.name
    }
    next();
  } catch (err) {
    return res.sendStatus(401)
  }
}

export default getAccessFacebook