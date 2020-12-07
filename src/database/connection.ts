import { Sequelize } from 'sequelize';
import pgp from "pg-promise"

require('dotenv').config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
pgp().pg.defaults.ssl = true;

const sequelize = new Sequelize(process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.PROD_DATABASE_URL, {
  define: {
    timestamps: false
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

export default sequelize