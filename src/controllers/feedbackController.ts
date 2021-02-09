import feedback, {Feedback} from '../models/feedbacks';
import {Request, Response} from "express"

const getFeedbacksData = (data: {count: number, rows: Feedback[]}) => {
  const { count: totalFeedbacks, rows: feedbacks } = data;
  return { totalFeedbacks, feedbacks };
};

const feedbacksByMasterId = (req: Request, res: Response) => {
  const limit: number = req.body.limit || 5;
  const master_id: number = req.body.master_id;

  feedback.findAndCountAll<Feedback>({
    where: {
      master_id: master_id
    },
    order: [
      ['createdAt', 'DESC']
    ],
    limit: limit
  })
    .then(result => {
      const response = getFeedbacksData(result);
      res.send(response);
    })
    .catch(() => {
      res.sendStatus(500)
      console.log("ERROR GET FEEDBACKS BY MASTER ID")
    })
}

const getPagination = (page: number) => {
  const limit = 3;
  const offset = page;
  return { limit, offset };
};

const getPagingData = (data: {count: number, rows: Feedback[]}, page: number, limit: number) => {
  const { count: totalfeedbacks, rows: feedbacks } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalfeedbacks / limit);
  return { totalfeedbacks, feedbacks, totalPages, currentPage };
};

const feedbacksPagination = (req: Request, res: Response) => {
  const { 
    page
  } = req.body;
  const { limit, offset } = getPagination(page);
  feedback.findAndCountAll<Feedback>({
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
      console.log("ERROR GET FEEDBACKS PAGINATION")
    })
}

export default {
  feedbacksByMasterId,
  feedbacksPagination
}