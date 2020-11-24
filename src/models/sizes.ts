import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class Size extends Model {
  public id?: number;
  public size: string;
  public price: number;
}

export type SizeModel = typeof Model & {
  new (values?: object, options?: BuildOptions): Size;
};

const size: SizeModel = sequelize.define<Size>('size', {
  size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
  }
}, {
});

export default size