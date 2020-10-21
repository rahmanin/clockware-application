require('dotenv').config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const pgp = require("pg-promise")();
pgp.pg.defaults.ssl = true;

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    timestamps: false
  }
})

module.exports = sequelize