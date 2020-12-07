import pgp from "pg-promise";

require('dotenv').config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
pgp().pg.defaults.ssl = true;

module.exports = {
	"development": {
		"database": process.env.PROD_DB,
		"username": process.env.PROD_DB_USERNAME,
		"password": process.env.PROD_DB_PASS,
		"dialect": 'postgres',
		"host": process.env.PROD_DB_HOST,
		"port": process.env.PROD_DB_PORT,
	},
	"test": {
		"database": process.env.TEST_DB,
		"username": process.env.TEST_DB_USERNAME,
		"password": process.env.TEST_DB_PASS,
		"dialect": 'postgres',
		"host": process.env.TEST_DB_HOST,
		"port": process.env.TEST_DB_PORT,
	},
	"production": {
		"database": process.env.PROD_DB,
		"username": process.env.PROD_DB_USERNAME,
		"password": process.env.PROD_DB_PASS,
		"dialect": 'postgres',
		"host": process.env.PROD_DB_HOST,
		"port": process.env.PROD_DB_PORT,
	}
}