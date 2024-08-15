const mysql = require("mysql2");
const poolClassicModels = mysql
    .createPool({
        connectionLimit: 151,
        host: "127.0.0.1",
        user: "root",
        password: "123",
        port: 33061,
        database: "classicmodels",
    })
    .promise();
poolClassicModels
    .on("acquire", (acquire) => {
        console.log(`MySQL DB connection ${acquire.threadId} is acquired`);
    })
    .on("connection", (connection) => {
        console.log(`mySQL DB connection ${connection.threadId} is connected`);
    });
    // .on("enqueue", () => {
    //     console.log(`Waiting for available connection slot`);
    // })
    // .on("release", (connection) => {
    //     console.log(`mySQL DB connection ${connection.threadId} released`);
    // });

module.exports = { poolClassicModels };
