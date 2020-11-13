const nodemailer = require("nodemailer");
require("dotenv").config();
const { pugEngine } = require("nodemailer-pug-engine");

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.use(
  "compile",
  pugEngine({
    templateDir: __dirname + "/templates",
    pretty: true,
  })
);

const sendEmailUnregisteredUser = async (
  name,
  email,
  size,
  city,
  date,
  master,
  price,
  time,
  url
) => {

  const options = {
    from: "transylvaniadream@gmail.com",
    subject: "Your order was created!",
    to: `${email}`,
    template: "orderWasCreated",
    ctx: {
      tName: name,
      tEmail: email,
      tSize: size,
      tCity: city,
      tDate: date,
      tMaster: master,
      tPrice: price,
      tTime: time,
      tUrl: url
    },
  };

  transporter
    .sendMail(options)
    .then((result) => console.log("MESSAGE WAS SENT"))
    .catch((err) => console.log("ERROR EMAIL SENDING", err));
};

const sendEmailRegisteredUser = async (
  name,
  email
) => {

  const options = {
    from: "transylvaniadream@gmail.com",
    subject: "Your order was created!",
    to: `${email}`,
    template: "orderWasCreatedLoggedClient",
    ctx: {
      tName: name,
    },
  };

  transporter
    .sendMail(options)
    .then((result) => console.log("MESSAGE WAS SENT"))
    .catch((err) => console.log("ERROR EMAIL SENDING", err));
};

module.exports = {
  sendEmailUnregisteredUser,
  sendEmailRegisteredUser
}
