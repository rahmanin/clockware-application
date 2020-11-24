import {Request, Response} from "express"
import size, { Size } from '../models/sizes';
import Validator from 'validatorjs';

interface RequestWithUserData extends Request {
  userData?: {
    role: string,
    master_id: number
  }
}

const getSizes = (_req: RequestWithUserData, res: Response) => {
  size.findAll<Size>()
    .then(sizes => res.json(sizes))
    .catch(() => {
      res.sendStatus(500)
      console.log("ERROR GET CITIES")
    });
}

const updatePrice = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    price: "required|integer"
  }
  const validator = new Validator(req.body, rules)
  if (validator.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const updatedPrice = req.body.price;

    size.update<Size>(
      {
        price: updatedPrice
      },
      {
        where: {
          id: id
        }
      }
    )
      .then(result => res.json(result))
      .catch(() => {
        res.sendStatus(500)
        console.log("ERROR, PRICE WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR PRICE PARAMS")
  }
}

export default {
  getSizes,
  updatePrice
}