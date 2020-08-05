require('dotenv').config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const pgp = require("pg-promise")();
pgp.pg.defaults.ssl = true;
const db = pgp(process.env.DATABASE_URL);

module.exports = db;
