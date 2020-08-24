const nodemailer = require('nodemailer');
require('dotenv').config();

const sendFeedbackEmailFunc = async (email, url) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
  });
  const options = {
    from: `CLOCKWARE`,
    to: `${email}`,
    subject: "Your order was completed!",
    html: `<p>${url}</p>   `
  }

  transporter.sendMail(options)
    .then(result => console.log("MESSAGE WAS SENT"))
    .catch(err => console.log("ERROR EMAIL SENDING", err))
  
}

module.exports = sendFeedbackEmailFunc;