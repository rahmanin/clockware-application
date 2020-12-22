import {Request, Response} from 'express';
import { OAuth2Client } from 'google-auth-library';

interface RequestWithUserData extends Request {
  userData?: Object
}

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const getAccessGoogle = async(req: RequestWithUserData, res: Response, next: () => void) => {
  try {
    const token = req.body.id_token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    req.userData = payload
    next();
  } catch (err) {
    return res.sendStatus(401)
  }
}

export default getAccessGoogle