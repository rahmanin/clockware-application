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

export default {
  feedbacksByMasterId
}