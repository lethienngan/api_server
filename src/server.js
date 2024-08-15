require("dotenv").config();
const path = require("path");
const os = require("os");
const { app } = require("./app.js");

// Set up ENV
require("dotenv").config({
    path: path.join(__dirname, ""),
});

const runServer = async (PORT, expressApp) => {
    try {
        process.env.UV_THREADPOOL_SIZE = 4
        // Connect to DB
        require("./configs/mongodb.config.js");

        // finally, START SERVER
        const server = expressApp.listen(PORT || 3333, () => {
            console.log(`Server is running at port: ${PORT} | mode: ${expressApp.get("env")}`);
            console.log("NodeJS worker PID: ", process.pid);
            console.log("NodeJS ThreadPool size:", process.env.UV_THREADPOOL_SIZE);
        });

        // cronjobs invoke here
        // if (process.env.CRON_JOBS === "true") require("./src/services/schedule.service");
    } catch (err) {
        console.error("Server Error:::", err);
    }
};

runServer(process.env.PORT, app);
