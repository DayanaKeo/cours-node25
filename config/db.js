const mysql = require('mysql');
const dbConfig = require('./db.config');

const connection = mysql.createConnection(
    {
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD,
        database: dbConfig.DATABASE
    }
);

connection.connect( error => {
    if(error) throw error;
    console.log('Je suis connecté  à mysql');
});

module.exports = connection;