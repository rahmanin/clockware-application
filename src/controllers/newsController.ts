import {Request, Response} from "express"
import news, { News } from '../models/news';

interface RequestWithUserData extends Request {
  userData?: {
    role: string,
  }
}

const getPagination = (page: number) => {
  const limit = 5;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

const getPagingData = (data: {count: number, rows: News[]}, page: number, limit: number) => {
  const { count: totalNews, rows: news } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalNews / limit);
  return { totalNews, news, totalPages, currentPage };
};

const getNewsPagination = (req: Request, res: Response) => {
  const { 
    page
  } = req.body;
  const { limit, offset } = getPagination(page);
  news.findAndCountAll<News>({
    order: [
      ['createdAt', 'DESC']
    ],
    limit: limit,
    offset: offset
  })
    .then(result => {
      const response = getPagingData(result, page, limit);
      res.send(response);
    })
    .catch(() => {
      res.sendStatus(500)
      console.log("ERROR GET NEWS PAGINATION")
    })
}

const getNewsList = (req: RequestWithUserData, res: Response) => {
  news.findAll<News>({
    order: [
      ['createdAt', 'DESC']
    ]
  })
    .then(result => res.json(result))
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR GET NEWS LIST", err)
    });
}

const postNews = (req: RequestWithUserData, res: Response) => {
  if (req.userData.role === "admin") {
    const {
      title,
      content
    } = req.body;

    news.create<News>({
      title: title,
      content: content,
      createdAt: new Date()
    })
      .then(result => res.json(result))
      .catch((err) => {
        res.sendStatus(500)
        console.log("ERROR POST NEWS", err)
      });
  } else {
    res.sendStatus(401)
    console.log("UNAUTHORIZED POST NEWS")
  }
}

const updateNews = (req: RequestWithUserData, res: Response) => {
  if (req.userData.role === "admin") {
    const {
      title,
      content
    } = req.body;
    const id = req.params.id
    news.update<News>(
      {
        title: title,
        content: content,
      },
      {
        where: {
          id: id
        }
      }
    )
      .then(result => {
        if (result[0]) {
          res.send({msg: "UPDATED", status: true})
        } else {
          res.send({msg: "Error to update. Press 'SAVE AS' button", status: false})
        }
      })
      .catch((err) => {
        res.sendStatus(500)
        console.log("ERROR UPDATE NEWS", err)
      });
  } else {
    res.sendStatus(401)
    console.log("UNAUTHORIZED UPDATE NEWS")
  }
}

const deleteNews = (req: RequestWithUserData, res: Response) => {
  if (req.userData.role === "admin") {
    const id = req.params.id
    news.destroy<News>({
        where: {
          id: id
        }
      }
    )
      .then(result => res.json(result))
      .catch((err) => {
        res.sendStatus(500)
        console.log("ERROR DELETE NEWS", err)
      });
  } else {
    res.sendStatus(401)
    console.log("UNAUTHORIZED DELETE NEWS")
  }
}

export default {
  postNews,
  updateNews,
  getNewsList,
  deleteNews,
  getNewsPagination
}