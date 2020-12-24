import user, {User} from '../models/users';
import Validator from 'validatorjs';
import bcrypt from 'bcryptjs';
import {Request, Response} from "express"
import jwt from 'jsonwebtoken';
import sendEmail from '../email/sendEmail';

interface RequestWithUserData extends Request {
  userData?: {
    registration: boolean,
    userId: number
  },
}


const checkUser = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    username: "required|min:2|max:15",
    email: "required|max:35|email",
  }

  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {
      username, 
      email, 
    } = req.body;

    user.findOrCreate<User>({
      where: {
        email: email
      },
      defaults: {
        username: username,
        email: email,
        role: "client"
      }
    })
      .then(result => {
        !result[0].password ? res.json({id: result[0].id}) : res.status(401).send({email: result[0].email})
      })
      .catch(() => {
        console.log("ERROR CHECK USER")
        res.sendStatus(500)
      })
  } else {
    console.log("ERROR CHECK USER")
    res.sendStatus(400)
  }
}

const userSetPassword = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    password: "required|max:30",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.registration) {
    const id = req.userData.userId;
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        console.log("ERROR")
        return res.sendStatus(500)
      } else {
        user.update<User>(
          {
            password: hash,
          },
          {
            where: {
              id: id
            },
            returning: true,
          }
        )
          .then(result => {
            res.json(result[1])
          })
          .catch(() => {
            console.log("ERROR, USER PASSWORD")
            res.sendStatus(500)
          })
      }
    })
  } else {
    console.log("ERROR USER PASSWORD PARAMS")
    res.sendStatus(400)
  }
}

const sendEmailToResetPassword = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    email: "required|max:35|email",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes()) {
    const {email} = req.body

    user.findOne<User>({
      where: {
        email: email
      }
    })
      .then(user => {
        if (user && user.role != "master") {
          const token = jwt.sign(
            {
              email: user.email, 
              userId: user.id,
              username: user.username,
              registration: true
            }, 
            process.env.SECRETKEY, 
            {
              expiresIn: '1d'
            }
          );
          const url = `${process.env.CLIENT_URL}/login?token=${token}`
          return sendEmail.sendEmailToResetPassword(
            user.username, 
            email, 
            url
          ).then(() => res.send({msg: `Link to create new password was sent to ${email}`}))
        } else if (user?.role === "master") {
          res.send({msg: `This <email: ${email}> is master's email. You have to contact with your admin to get new password`})
        } else {
          res.send({msg: `User with <email: ${email}> doesn't exist`})
        } 
      })
      .catch(() => {
        console.log("ERROR SEND EMAIL TO RESET PASSWORD")
        res.sendStatus(500)
      })
  } else {
    console.log("BAD REQUEST TO SEND EMAIL TO RESET PASSWORD")
    res.sendStatus(400)
  }
}

export default {
  checkUser,
  userSetPassword,
  sendEmailToResetPassword
}