const nodemailer = require('nodemailer');
require('dotenv').config();
const { pugEngine } = require("nodemailer-pug-engine");

const sendEmailFunc = async (name, email, size, city, date, master, price, time) => {

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
    subject: 'Your order was created!',
    to: `${email}`,
    template: 'orderWasCreated',
    ctx: {
      tName: name, 
      tEmail: email, 
      tSize: size, 
      tCity: city, 
      tDate: date, 
      tMaster: master, 
      tPrice: price, 
      tTime: time
    }
  }

  transporter.sendMail(options)
    .then(result => console.log("MESSAGE WAS SENT"))
    .catch(err => console.log("ERROR EMAIL SENDING", err))
  
}

module.exports = sendEmailFunc;