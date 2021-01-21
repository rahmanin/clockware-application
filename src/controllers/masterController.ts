import {Request, Response} from "express"
import master, { Master } from '../models/masters';
import Validator from 'validatorjs';
import { Op } from "sequelize";
import user, { User } from '../models/users';
import bcrypt from 'bcryptjs';
import sequelize from "sequelize";

interface RequestWithUserData extends Request {
  userData?: {
    role: string,
    master_id: number
  }
}

const getMasters = (_req: RequestWithUserData, res: Response) => {
  master.findAll<Master>({
    include: [{
      model: user,
      attributes: [["username", "master_name"], "email"]
    }]
  })
    .then(masters => res.json(masters))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR GET MASTERS", err)
    });
}

const getMasterVotesById = (req: RequestWithUserData, res: Response) => {
  const {master_id} = req.userData

  master.findByPk<Master>(master_id)
    .then(result => {
      if (!result) return; 
      res.json(result);
    })
    .catch(() => {
      res.sendStatus(500)
      console.log("ERROR GET VOTES")
    });
}

const createMaster = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    master_name: "required|max:20",
    city: "required|max:20",
    email: "required|max:35|email",
  }

  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const {
      master_name,
      city,
      email
    } = req.body;

    user.create<User>({
      username: master_name,
      email: email,
      role: "master"
    })
      .then(() => console.log("USER WAS ADDED"))
      .catch(() => {
        res.status(500).send({msg: "User with this email exists"})
        console.log("ERROR, USER WAS NOT ADDED")
      })
      .then(() => user.max<number, User>('id'))
      .then(result => user.findOne({
        where: {
          id: result
        }
      }))
      .then(result => {
        master.create<Master>({
          id: result.id,
          city: city,
        })
        .then((master: any) => res.json({
          ...master.dataValues, 
          master_name: master_name, 
          email: email
        }))
      })
      .catch(() => {
        res.sendStatus(500)
        console.log("ERRORS WITH NEW MASTER")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR MASTER POST")
  }
}

const deleteMaster = (req: RequestWithUserData, res: Response) => {
  const id = req.params.id;

  req.userData.role === "admin" && user.destroy<User>({
    where: {
      id: id
    }
  })
    .then(result => res.json(result))
    .catch(() => {
      console.log("ERROR, MASTER WAS NOT DELETED")
      res.sendStatus(401)
    })
}

const updateMaster = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    master_name: "required|max:20",
    city: "required|max:20",
    email: "required|max:35|email",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const {
      master_name,
      city,
      email
    } = req.body;

    master.update<Master>(
      {
        city: city,
      },
      {
        where: {
          id: id
        }
      }
    )
      .then(() => user.update<User>(
        {
          username: master_name,
          email: email,
        },
        {
          where: {
            id: id
          }
        }
      ))
      .then(result => res.json(result))
      .catch(() => {
        res.status(500).send({msg: "User with this email exists"})
        console.log("ERROR, MASTER WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR MASTER PUT")
  }
}

const setMasterPassword = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    password: "required|max:30",
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;

    bcrypt.hash(req.body.password, 10, (err: any, hash: string) => {
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
            }
          }
        )
          .then(() => res.sendStatus(200))
          .catch(() => {
            res.sendStatus(500)
            console.log("ERROR, MASTER PASSWORD")
          })
      }
    })
  } else {
    res.sendStatus(400)
    console.log("ERROR MASTER PASSWORD")
  }
}

const findMaster = (req: RequestWithUserData, res: Response) => {
  const {searchParam} = req.body

  user.findAll<User>({
    where: {
      username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), 'LIKE', searchParam.toLowerCase() + '%')
    }
  })
  .then(result => {
    const mastersArray = result.map((master: any) => `${master.username}, id:${master.id}`)
    res.send(mastersArray)
  })
  .catch(() => {
    res.sendStatus(500)
    console.log("ERROR FIND MASTER")
  })

}

export default {
  getMasters,
  getMasterVotesById,
  createMaster,
  deleteMaster,
  updateMaster,
  setMasterPassword,
  findMaster
}