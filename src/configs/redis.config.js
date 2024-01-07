// require("dotenv").config();
// const redis = require("redis");
// const redisClient = redis
//     .createClient({
//         host: process.env.REDIS_HOST,
//         port: process.env.REDIS_PORT,
//         // legacyMode: true,
//     })
//     .on("connect", () => {
//         console.log("Redis connected");
//     })
//     .on("ready", () => {
//         console.log("Redis connected and ready to use");
//     })
//     .on("end", () => {
//         console.log("Redis disconnected");
//     })
//     .on("error", (err) => {
//         console.log("Redis Error:", err);
//     })
//     .on("reconnecting", () => {
//         console.log("Redis trying to connect...");
//     });
// process.on("SIGINT", () => {
//     redisClient.quit();
// });

// redisClient.connect();

// module.exports = { redisClient };
