const nodemailer = require("nodemailer");
require("dotenv").config();
const { pugEngine } = require("nodemailer-pug-engine");
const writeReportInfo = require ("../controllers/mail_report_infosController")


const sendEmailAdminReport = async (
  countIncompleted
) => {
  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); 
  const yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

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
    .then(res => {
      console.log("MESSAGE WAS SENT")
      writeReportInfo(true)
    })
    .catch(err => {
      console.log("ERROR EMAIL REPORT SENDING")
      writeReportInfo(false)
    });
};

module.exports = sendEmailAdminReport