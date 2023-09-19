const fs = require("fs").promises;
const path = require("path");
const { format } = require("date-fns");

const fileName = path.join(__dirname, "../Logs", "logs.log");

const logEvents = (msg) => {
	const dateTime = `${format(new Date(), "dd-MM-yyyy HH:mm:ss")}`;
	const contentLog = `${dateTime} --- ${msg}\n`;
	try {
		fs.appendFile(fileName, contentLog);
	} catch (error) {
		console.error("logEvent error:", error);
	}
};

module.exports = { logEvents };
