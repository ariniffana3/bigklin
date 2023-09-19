const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST_ONLINE,
  user: process.env.MYSQL_USER_ONLINE,
  password: process.env.MYSQL_PASSWORD_ONLINE,
  database: process.env.MYSQL_DATABASE_ONLINE,
});

// connection.connect(async (error) => {
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   console.log('You"re now connected db mysql ...');
// });

module.exports = connection;
