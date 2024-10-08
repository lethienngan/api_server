const createHttpError = require("http-errors");
const { redisClient } = require("../configs/redis.config");
const { commonRateLimit } = require("../middlewares/RateLimit.middleware");
const { sleep } = require("../utils/asyncHandler");
const route = require("express").Router();

route.get("/getList", async (req, res, next) => {
    try {
        // await sleep(3000)
        return res.status(200).json("ok");
    } catch (error) {
        console.log(error);
    }
});
route.post("/rateLimit", commonRateLimit, (req, res, next) => {
    try {
        return res.status(200).json("OK");
    } catch (err) {
        console.log(err);
    }
});
route.post("/setRedis", async (req, res, next) => {
    try {
        const setResult = await redisClient.set("myKey1", Date.now(), {
            NX: true,
        });
        if(!setResult) {
           return next(createHttpError[400](result))
        }
        
        res.status(200).send("OK");
    } catch (error) {
        console.log(error);
    }
});

// Test websocket server
route.post("/socketServer", async (req, res, next) => {
    try {
        const io = require("socket.io")(3334, {
            cors: {
                origin: ["http://192.168.1.8:8080"],
            },
        });
        console.log("socket is connecting...");
        await io.on("connection", (socket) => {
            console.log("socket is connected...");
            console.log(socket.id);
            socket.on("message", (data) => {
                console.log(data);
            });
            socket.emit("assign_rule_template", "hello world");
        });
        return res.status(200).send("OK");
    } catch (error) {
        console.log(error);
    }
});

// Test websocket client
route.post("/socketClient", async (req, res, next) => {
    try {
        const io = require("socket.io-client");
        console.log("socket is connecting...");
        io.on("connection", (socket) => {
            console.log("socket is connected...");
            console.log(socket.id);
            socket.on("message", (data) => {
                console.log(data);
            });
            socket.emit("assign_rule_template", "hello world");
        });
        return res.status(200).send("OK");
    } catch (error) {
        console.log(error);
    }
});

module.exports = { route };
