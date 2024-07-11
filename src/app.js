const path = require("path");
const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const os = require("os");
// Import local modules
const { connectMongoDb } = require("./configs/mongodb.config");
const { ErrorHandler, invalidPathHandler } = require("./middlewares/ErrorHandler.middleware");
const { route: userRouter } = require("./routes/User.route");
const { route: driveRouter } = require("./routes/GoogleApi.route");
const { route: sqlRouter } = require("./routes/postgres.route");
const { route: testingRouter } = require("./routes/testing.route");
const { route: kafkaProducer } = require("./routes/Kafka.route");
const { route: sseRouter } = require("./routes/SSE.route");
const { route: orderRoute } = require("./routes/order.route");

// Set up ENV
require("dotenv").config({
    path: path.join(__dirname, ""),
});

const PORT = process.env.PORT;

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
app.use("/v1/order", orderRoute);

// Error Handling
app.use(invalidPathHandler());
app.use(ErrorHandler());

module.exports = {app}
