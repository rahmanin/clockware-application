import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class User extends Model {
  public id?: number;
  public username: string;
  public password: string;
  public last_login: number;
  public email: number;
  public role: number;
}

export type UserModel = typeof Model & {
  new (values?: object, options?: BuildOptions): User;
};

const user: UserModel = sequelize.define<User>('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
  },
  last_login: {
    type: DataTypes.DATE,
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  role: {
    type: DataTypes.STRING,
  },
}, {
});

export default user
