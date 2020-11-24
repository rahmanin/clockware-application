import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class Feedback extends Model {
  public id?: number;
  public feedback: string;
  public evaluation: number;
  public master_id: number;
  public order_id: number;
  public createdAt: Date;
}

export type FeedbackModel = typeof Model & {
  new (values?: object, options?: BuildOptions): Feedback;
};

const feedback: FeedbackModel = sequelize.define<Feedback>('feedbacks_clients', {
  evaluation: {
    type: DataTypes.INTEGER,
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  master_id: {
    type: DataTypes.INTEGER,
  },
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  createdAt: {
    type: DataTypes.DATE
  }
}, {
});

export default feedback