import {Request, Response} from "express"
import Validator from 'validatorjs';
import user, { User } from '../models/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

require('dotenv').config();

interface RequestWithUserData extends Request {
  userData?: {
    userId: number,
    role: string,
    email: string,
    username: string,
    registration?: boolean,
    name: string,
  }
}

const logIn = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    email: "required|max:35|email",
    password: "required|max:30"
  }
  
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    user.findOne<User>({
      where: {
        email: req.body.email
      }
    })
      .then(result => {
        if (!result) return res.status(401).send({msg: 'Entered email is incorrect!'});
        bcrypt.compare(req.body.password, result.password)
          .then(resultBcrypt => {
            if (!resultBcrypt) return res.status(401).send({msg: 'Entered password is incorrect!'});
            const token = jwt.sign(
              {
                email: result.email, 
                userId: result.id,
                role: result.role,
                username: result.username
              }, 
              process.env.SECRETKEY, 
              {
                expiresIn: '1d'
              }
            );

            user.update<User>(
              {
                last_login: new Date()
              },
              {
                where: {
                  id: result.id
                }
              }
            )
            .then(() => console.log("LAST_LOGIN UPDATED"))
            .catch(() => {
              res.sendStatus(500)
              console.log("LAST_LOGIN ERROR")
            })

            res.status(200).json({
              msg: 'Logged in!',
              token,
              userId: result.id,
              role: result.role,
              email: result.email,
              username: result.username
            });
            console.log("LOGGING IN FINISHED SUCCESSFULLY")
          })
          .catch(err => {
            res.sendStatus(500)
            console.log("ERROR WHEN COMPARE", err)
          })
      })
      .catch(error => {
        console.log("ERROR WHEN LOG IN", error)
        res.sendStatus(500)
      })
  } else {
    res.sendStatus(400)
    console.log("LOGIN ERROR")
  }
}

const checkToken = (req: RequestWithUserData, res: Response) => {
  const {
    userId,
    role,
    email,
    username,
    registration
  } = req.userData;
  
  res.json({userId, role, email, username, registration})
}

const googleFacebookLogIn = (req: RequestWithUserData, res: Response) => {
  const {
    name,
    email
  } = req.userData;

  user.findOrCreate<User>({
    where: {
      email: email
    },
    defaults: {
      username: name,
      email: email,
      role: "client"
    }
  })
  .then(result => {
    const token = jwt.sign(
      {
        email: result[0].email, 
        userId: result[0].id,
        role: result[0].role,
        username: result[0].username
      }, 
      process.env.SECRETKEY, 
      {
        expiresIn: '1d'
      }
    );
    res.status(200).json({
      msg: 'Logged in!',
      token,
      userId: result[0].id,
      role: result[0].role,
      email: result[0].email,
      username: result[0].username
    });
  })
  .catch(error => {
    console.log("ERROR WHEN LOG IN", error)
    res.sendStatus(500)
  })
}

export default {
  logIn,
  checkToken,
  googleFacebookLogIn
}