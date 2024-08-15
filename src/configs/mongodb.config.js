const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = (uri, nickname) => {
    const conn = mongoose.createConnection(uri);
    conn.on("connecting", () => {
        console.log("Mongoose DB is connecting...");
    })
        .on("connected", () => {
            console.log("Mongoose DB is connected and ready to use: ", nickname);
        })
        .on("disconnected", () => {
            console.log("Mongoose DB is disconnected");
        })
        .on("error", (err) => {
            console.log("Mongoose DB connection is error:", err);
        });

    return conn;
};

const mongoAtlast = connectDb(process.env.MONGO_URI, "atlas mongodb");
const mongoLocal = connectDb("mongodb://localhost:27017/", "local mongodb");
module.exports = { mongoAtlast, mongoLocal };
