import nodemailer from "nodemailer";
import { pugEngine } from "nodemailer-pug-engine";

require("dotenv").config();

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
  name: string,
  email: string,
  size: string,
  city: string,
  date: string,
  master: string,
  price: number,
  time: string,
  url: string
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
    .then(() => console.log("MESSAGE WAS SENT"))
    .catch(() => console.log("ERROR EMAIL SENDING"));
};

const sendEmailRegisteredUser = async (
  name: string,
  email: string
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
    .then(() => console.log("MESSAGE WAS SENT"))
    .catch(() => console.log("ERROR EMAIL SENDING"));
};

export default {
  sendEmailUnregisteredUser,
  sendEmailRegisteredUser
}
