import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'
import user from './users';
import feedback from './feedbacks';

export class Order extends Model {
  public order_id: number;
  public city: string;
  public size: string;
  public order_date: string;
  public order_master: string;
  public feedback_client_id: number;
  public feedback_master: string;
  public order_price: number;
  public additional_price: number;
  public is_done: boolean;
  public master_id: number;
  public order_time_start: string;
  public order_time_end: string;
  public image: string;
  public client_id: number;
  public isPaid: boolean;
}

export type OrderModel = typeof Model & {
  new (values?: object, options?: BuildOptions): Order;
};

const order: OrderModel = sequelize.define<Order>('order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  order_date: {
    type: DataTypes.STRING,
  },
  order_master: {
    type: DataTypes.STRING,
  },
  feedback_client_id: {
    type: DataTypes.INTEGER,
  },
  feedback_master: {
    type: DataTypes.TEXT,
  },
  order_price: {
    type: DataTypes.INTEGER,
  },
  additional_price: {
    type: DataTypes.INTEGER,
  },
  is_done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  master_id: {
    type: DataTypes.INTEGER,
  },
  order_time_start: {
    type: DataTypes.TEXT,
  },
  order_time_end: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING
  },
  client_id: {
    type: DataTypes.INTEGER,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
});

order.belongsTo(user, {foreignKey: 'client_id'})
order.belongsTo(feedback, {foreignKey: 'feedback_client_id'})

export default order
