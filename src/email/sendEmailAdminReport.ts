import nodemailer from "nodemailer";
import { pugEngine } from "nodemailer-pug-engine";
import writeReportInfo from "../controllers/mail_report_infosController";
import today from '../constants/todaysDate';

require("dotenv").config();

const sendEmailAdminReport = async (
  countIncompleted: number
) => {
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
    subject: "Everydays report",
    to: process.env.ADMIN_EMAIL,
    template: "adminReport",
    ctx: {
      tCount: countIncompleted,
      tDate: today
    },
  };

  transporter
    .sendMail(options)
    .then(() => {
      console.log("MESSAGE WAS SENT")
      writeReportInfo(true)
    })
    .catch(() => {
      console.log("ERROR EMAIL REPORT SENDING")
      writeReportInfo(false)
    });
};

export default sendEmailAdminReport