const { Pool } = require("pg");

const connections = {
  production: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  development: { connectionString: process.env.DB_URL },
  testing: { connectionString: process.env.DB_TEST_URL },
};

console.log(connections[process.env.NODE_ENV]);

const db = new Pool(connections[process.env.NODE_ENV]);

console.log("DB initiated");

module.exports = db;
