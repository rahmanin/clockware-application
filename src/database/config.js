require('dotenv').config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const pgp = require("pg-promise")();
pgp.pg.defaults.ssl = true;

module.exports = {
	database: process.env.DB,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASS,
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
}