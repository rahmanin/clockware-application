import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

interface RequestWithUserData extends Request {
  userData?: Object
}

require('dotenv').config();

const getAccess = (req: RequestWithUserData, res: Response, next: () => void) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(
      token,
      process.env.SECRETKEY
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}

export default getAccess