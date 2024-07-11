require("dotenv").config();
const { app } = require("./app.js");
const { connectMongoDb } = require("./configs/mongodb.config.js");

const runServer = async (PORT, expressApp) => {
    try {
        // Connect to DB
        await connectMongoDb(process.env.MONGO_URI).catch((err) => {
            throw new Error(err);
        });

        // finally, START SERVER
        const server = expressApp.listen(PORT || 3333, () => {
            console.log(`Server is running at port: ${PORT} | mode: ${app.get("env")}`);
            console.log("Worker PID: ", process.pid);
        });

        // cronjobs invoke here
        // if (process.env.CRON_JOBS === "true") require("./src/services/schedule.service");
    } catch (err) {
        console.error("Server Error:::", err);
    }
};

runServer(process.env.PORT, app);
