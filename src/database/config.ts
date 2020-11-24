import pgp from "pg-promise";

require('dotenv').config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
pgp().pg.defaults.ssl = true;

module.exports = {
	database: process.env.PROD_DB,
	username: process.env.PROD_DB_USERNAME,
	password: process.env.PROD_DB_PASS,
	dialect: 'postgres',
	host: process.env.PROD_DB_HOST,
	port: process.env.PROD_DB_PORT,
}