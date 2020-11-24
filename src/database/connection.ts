import { Sequelize } from 'sequelize';
import pgp from "pg-promise"

require('dotenv').config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
pgp().pg.defaults.ssl = true;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    timestamps: false
  }
})

export default sequelize