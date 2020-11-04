const mail_report_info = require('../models/mail_report_infos');

const writeReportInfo = status => {
    mail_report_info.create({
      createdAt: new Date(),
      status: status
    })
    .then(res => console.log("REPORT CREATED"))
    .catch(err => console.log("ERROR REPORT"))
  }

module.exports = writeReportInfo