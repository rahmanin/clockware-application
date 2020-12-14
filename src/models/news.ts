import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../database/connection'

export class News extends Model {
  public id?: number;
  public title: string;
  public content: string;
  public createdAt: Date
}

export type NewsModel = typeof Model & {
  new (values?: object, options?: BuildOptions): News;
};

const news: NewsModel = sequelize.define<News>('news', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
});

export default news