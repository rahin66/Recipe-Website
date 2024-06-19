var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "200506" 
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql_database = "CREATE DATABASE chefsavvy";
    con.query(sql_database, function (err, result) {
        if (err) throw err;
        console.log("csit128_example Database Created");
    });
});
