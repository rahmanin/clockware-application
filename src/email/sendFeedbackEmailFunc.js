const nodemailer = require("nodemailer");
require("dotenv").config();
const { pugEngine } = require("nodemailer-pug-engine");

const sendFeedbackEmailFunc = async (email, url) => {
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
    .then((result) => console.log("MESSAGE WAS SENT"))
    .catch((err) => console.log("ERROR EMAIL SENDING", err));
};

module.exports = sendFeedbackEmailFunc;
