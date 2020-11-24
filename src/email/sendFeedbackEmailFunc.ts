import nodemailer from "nodemailer";
import { pugEngine } from "nodemailer-pug-engine";

require("dotenv").config();

const sendFeedbackEmailFunc = async (email: string, url: string) => {

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

  const options = {
    from: "transylvaniadream@gmail.com",
    to: `${email}`,
    subject: "Your order was completed!",
    template: "orderWasDone",
    ctx: {
      tUrl: url.replace(/ /g,"%20"),
    },
  };

  transporter
    .sendMail(options)
    .then(() => console.log("MESSAGE WAS SENT"))
    .catch(() => console.log("ERROR EMAIL SENDING"));
};

export default sendFeedbackEmailFunc;