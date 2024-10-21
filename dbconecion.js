const mysql = require('mysql');

// database connection 
const db = mysql.createConnection ({
    host: 'localhost3000',
    user: 'root',
    password: '123qwe',
    database: 'productos_db'
  });
  
  // connect to database
  db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
  });
  

  module.exports = db;