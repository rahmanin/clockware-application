import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class Report extends Model {
  public id?: number;
  public createdAt: Date;
  public status: boolean;
}

export type ReportModel = typeof Model & {
  new (values?: object, options?: BuildOptions): Report;
};


const mail_report_info: ReportModel = sequelize.define<Report>('mail_report_infos', {
  createdAt: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.BOOLEAN
  }
}, {
});

export default mail_report_info