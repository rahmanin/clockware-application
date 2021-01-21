import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class City extends Model {
  public id?: number;
  public city: string;
  public delivery_area: string;
}

export type CityModel = typeof Model & {
  new (values?: object, options?: BuildOptions): City;
};

const city: CityModel = sequelize.define<City>('city', {
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  delivery_area: {
    type: DataTypes.TEXT,
  }
}, {
});

export default city