import {Request, Response} from "express"
import city, { City } from '../models/cities';
import Validator from 'validatorjs';

interface RequestWithUserData extends Request {
  userData?: {
    role: string
  }
}

const getCities = (_req: RequestWithUserData, res: Response) => {
  city.findAll<City>()
    .then(cities => {
      res.json(cities)
    })
    .catch(() => {
      res.sendStatus(500)
      console.log("ERROR GET CITIES")
    });
}

const createCity = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const newCity: string = req.body.city;
    city.create<City>({
      city: newCity
    })
      .then(() => console.log("CITY WAS ADDED"))
      .catch(() => {
        res.status(500).send({msg: "This city already exists"})
        console.log("ERROR, CITY WAS NOT ADDED")
      })
      .then(() => city.max<number, City>('id'))
      .then(result => city.findOne<City>({
        where: {
          id: result
        }
      }))
      .then(result => res.send(result))
      .catch(() => {
        res.sendStatus(500)
        console.log("ERRORS WITH NEW CITY")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR POST CITY")
  }
}

const deleteCity = (req: RequestWithUserData, res: Response) => {
  const id = req.params.id;

  req.userData.role === "admin" && city.destroy<City>({
    where: {
      id: id
    }
  })
    .then(result => res.json(result))
    .catch(() => {
      res.sendStatus(401)
      console.log("ERROR, CITY WAS NOT DELETED")
    })
}

const updateCity = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    city: "required|max:20"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const updatedCity: string = req.body.city;

    city.update<City>(
      {
        city: updatedCity
      },
      {
        where: {
          id: id
        }
      }
    )
      .then(result => res.json(result))
      .catch(() => {
        res.status(500).send({msg: "This city already exists"})
        console.log("ERROR, CITY WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR PUT CITY")
  }
}

const updateDeliveryArea = (req: RequestWithUserData, res: Response) => {
  const rules: {[key: string]: string} = {
    updatedArea: "required|array"
  }
  const validation = new Validator(req.body, rules)
  if (validation.passes() && req.userData.role === "admin") {
    const id = req.params.id;
    const updatedArea: string = req.body.updatedArea;

    city.update<City>(
      {
        delivery_area: JSON.stringify(updatedArea)
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
        console.log("ERROR, AREA WAS NOT UPDATED")
      })
  } else {
    res.sendStatus(400)
    console.log("ERROR PUT AREA")
  }
}

export default {
  getCities,
  createCity,
  updateCity,
  deleteCity,
  updateDeliveryArea
}