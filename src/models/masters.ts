import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'
import user from './users';

export class Master extends Model {
  public id?: number;
  public city: string;
  public rating: number;
  public votes: number;
}

export type MasterModel = typeof Model & {
  new (values?: object, options?: BuildOptions): Master;
};

const master: MasterModel = sequelize.define<Master>('master', {
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.REAL,
  },
  votes: {
    type: DataTypes.INTEGER,
  },
}, {
});

master.belongsTo(user, {foreignKey: 'id'})

export default master