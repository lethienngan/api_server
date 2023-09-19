require("dotenv").config();
const redis = require("redis");
const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	// legacyMode: true,
});
client.on("connect", () => {
	console.log("Redis connected");
});
client.on("ready", () => {
	console.log("Redis connected and ready to use");
});
client.on("end", () => {
	console.log("Redis disconnected");
});
client.on("error", (err) => {
	console.log("Redis Error:", err);
});
client.on("reconnecting", () => {
	console.log("Redis trying to connect...");
});
process.on("SIGINT", () => {
	client.quit();
});

const connectRedis = () => {
	return client.connect();
};
module.exports = { connectRedis, client };
