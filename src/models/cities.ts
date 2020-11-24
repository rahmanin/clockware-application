import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class City extends Model {
  public id?: number;
  public city: string;
}

export type CityModel = typeof Model & {
  new (values?: object, options?: BuildOptions): City;
};

const city: CityModel = sequelize.define<City>('city', {
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
});

export default city