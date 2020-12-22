import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'
import user from './users';
import feedback from './feedbacks';

export class SubscrSetting extends Model {
  public id: number;
  public subscription: string;
  public user_token: string;
  public endpoint: string;
  public user_id: number;
}

export type SubscrSettingModel = typeof Model & {
  new (values?: object, options?: BuildOptions): SubscrSetting;
};

const subscription_settings: SubscrSettingModel = sequelize.define<SubscrSetting>('subscription_settings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  subscription: {
    type: DataTypes.TEXT,
  },
  user_token: {
    type: DataTypes.TEXT,
  },
  endpoint: {
    type: DataTypes.TEXT,
  },
  user_id: {
    type: DataTypes.INTEGER,
  }
}, {
});

subscription_settings.belongsTo(user, {foreignKey: 'user_id'})

export default subscription_settings
