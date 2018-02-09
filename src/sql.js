'use strict';
const config = require('../config');
const sql = require('mssql');

const connect = (pool) => {
	if (!pool.connected) {
		pool.connect(err => err ? console.log(err) : console.log('Connected to SQL'));
	}
};

const pool = new sql.ConnectionPool({
	user: config.sqlUser,
	password: config.sqlPwd,
	server: config.sqlServer,
	database: config.sqlDatabase,
	options: {
		encrypt: true,
	},
	pool: {
		min: 1,
		max: 5,
		autostart: true,
		idleTimeoutMillis: 30000
	}
});

connect(pool);

pool.on('error', err => console.log(err));

module.exports = new sql.Request(pool);