require('dotenv').config();
var mysql  = require('mysql2');

var connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
})
connection.connect(function(err) {
    if (err) {
      console.log(err);
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})

module.exports = connection;