const feedback = require('../models/feedbacks');

const getFeedbacksData = data => {
  const { count: totalFeedbacks, rows: feedbacks } = data;
  return { totalFeedbacks, feedbacks };
};

const feedbacksByMasterId = (req, res) => {
  const limit = req.body.limit || 5;
  const master_id = req.body.master_id;

  feedback.findAndCountAll({
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
    .catch(err => {
      res.sendStatus(500)
      console.log("ERROR GET FEEDBACKS BY MASTER ID")
    })
}

module.exports = {
  feedbacksByMasterId
}