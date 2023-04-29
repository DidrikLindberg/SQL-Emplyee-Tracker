// require express and mysql2
const express = require('express');
const mysql = require('mysql2');

// PORT designation and app express
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db_connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
  },
        console.log(`Connected to the books_db database.`)
);

module.exports = db_connection;
