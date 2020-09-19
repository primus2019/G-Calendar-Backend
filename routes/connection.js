var mysql = require('mysql2');

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'jlc123456',
  database: 'designstudio'
});

module.exports = pool;
