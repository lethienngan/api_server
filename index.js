require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import local modules
const { connectMongoDb } = require("./src/configs/mongodb.config");
const { ErrorHandler, invalidPathHandler } = require("./src/middlewares/ErrorHandler.middleware");
const { route: userRouter } = require("./src/routes/User.route");
const { route: driveRouter } = require("./src/routes/GoogleApi.route");
const { route: sqlRouter } = require("./src/routes/postgres.route");
const { route: testingRouter } = require("./src/routes/testing.route");
const { route: kafkaProducer } = require("./src/routes/Kafka.route");
const { route: sseRouter } = require("./src/routes/SSE.route");

const PORT = process.env.PORT || 3333;

// Express middleware - plugin
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use("/v1/user", userRouter);
app.use("/v1/drive", driveRouter);
app.use("/v1/db", sqlRouter);
app.use("/v1/testing", testingRouter);
app.use("/v1/kafka", kafkaProducer);
app.use("/v1/sse", sseRouter);

// Error Handling
app.use(invalidPathHandler());
app.use(ErrorHandler());

// Start app
(async () => {
    try {
        await connectMongoDb(process.env.MONGO_URI).catch((err) => {
            throw new Error(err);
        });

        // finally, START SERVER
        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
        });

        // cronjobs invoke here
        // if (process.env.CRON_JOBS === "true") require("./src/services/schedule.service");
    } catch (err) {
        console.error("Server Error:::", err);
    }
})();
