const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connection
	.on("connecting", () => {
		console.log("Mongoose DB is connecting...");
	})
	.on("connected", () => {
		console.log("Mongoose DB is connected and ready to use");
	})
	.on("disconnected", () => {
		console.log("Mongoose DB is disconnected");
	})
	.on("error", (err) => {
		console.log("Mongoose DB connection is error:", err);
	});
process.on("SIGINT", async () => {
	await mongoose.connection.close();
	process.exit(0);
});

const connectMongoDb = async (uri) => {
	return mongoose.connect(uri);
};

module.exports = { connectMongoDb };
