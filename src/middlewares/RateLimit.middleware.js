const rateLimit = require("express-rate-limit");
const { redisClient } = require("../configs/redis.config");
const createHttpError = require("http-errors");

// By checking IP with specific gap time for each request
const commonRateLimit = async (req, res, next) => {
    {
        try {
            const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const requestInfo = `user|${ip}|${req.originalUrl}`;
            const curTimeStamp = Date.now();
            const prevTimeStamp = await redisClient.get(requestInfo);

            // if IP address does not exist -> create new one & store in Redis -> PASSED
            if (prevTimeStamp === null) {
                await redisClient.set(requestInfo.toString(), curTimeStamp, {
                    EX: 10,
                });
                return next();
            }

            // compare timestamp between previous req with current req
            if (parseInt(curTimeStamp) - parseInt(prevTimeStamp) < 200) {
                return res.status(400).json({ status: 400, msg: "Server too busy" });
            }

            // If PASS, set new timestamp for user's ip on redis
            await redisClient.set(requestInfo.toString(), curTimeStamp, {
                EX: 10,
            });
            return next();
        } catch (err) {
            // console.log(err);
            next(createHttpError.InternalServerError(err));
        }
    }
};

module.exports = {
    commonRateLimit,
};
