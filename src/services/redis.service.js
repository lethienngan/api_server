const { redisClient } = require("../configs/redis.config");

const redis_setRefreshToken = async (userId, token, option) => {
    try {
        await redisClient.set(userId, token, option);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { redis_setRefreshToken };
