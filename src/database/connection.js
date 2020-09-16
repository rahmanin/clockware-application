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

// sequelize.authenticate()
//   .then(res => console.log('Connection has been established successfully'))
//   .catch(err => console.log('Unable to connect to the database'))

sequelize.sync()

module.exports = sequelize