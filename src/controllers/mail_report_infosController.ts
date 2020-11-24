import mail_report_info, {Report} from '../models/mail_report_infos';

const writeReportInfo = (status: boolean) => {
    mail_report_info.create<Report>({
      createdAt: new Date(),
      status: status
    })
    .then(() => console.log("REPORT CREATED"))
    .catch(() => console.log("ERROR REPORT"))
  }

export default writeReportInfo