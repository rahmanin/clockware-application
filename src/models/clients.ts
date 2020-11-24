import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class Client extends Model {
  public id?: number;
  public client_name: string;
  public client_email: string;
}

export type ClientModel = typeof Model & {
  new (values?: object, options?: BuildOptions): Client;
};

const client: ClientModel = sequelize.define<Client>('client', {
  client_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  client_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
});

export default client