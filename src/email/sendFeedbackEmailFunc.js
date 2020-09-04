const nodemailer = require('nodemailer');
require('dotenv').config();
const { pugEngine } = require("nodemailer-pug-engine");

const sendFeedbackEmailFunc = async (email, url) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
  });
  
  transporter.use('compile', pugEngine({
    templateDir: __dirname + '/templates',
    pretty: true
  }));

  const options = {
    to: `${email}`,
    subject: "Your order was completed!",
    template: 'orderWasDone',
    ctx: {
      tUrl: url,
    }
  }

  transporter.sendMail(options)
    .then(result => console.log("MESSAGE WAS SENT"))
    .catch(err => console.log("ERROR EMAIL SENDING", err))
  
}

module.exports = sendFeedbackEmailFunc;