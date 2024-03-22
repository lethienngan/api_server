const { setnx } = require("../services/redis.service");

const buy = async (req, res, next) => {
    try {
        const inStock = 10;
        const keyName = "iphone";
        const buyNum = 1;

        await setnx(keyName, buyNum);

        return res.status(200).json({
            status: "OK",
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    buy,
};
