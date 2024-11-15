require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.URLDB,
    user: process.env.USUARIO,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.NAMEDB
});

module.exports = pool.promise();