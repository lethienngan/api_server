require("dotenv").config();
const jwt = require("jsonwebtoken");

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: "60s",
        };
        jwt.sign(
            { userId },
            process.env.ACCESS_TOKEN_SECRET,
            options,
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};

const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: "1h",
        };

        jwt.sign(
            { userId },
            process.env.REFRESH_TOKEN_SECRET,
            options,
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};

const verifyAccessToken = (bearerToken) => {
    return new Promise((resolve, reject) => {
        const token = bearerToken.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
};
const verifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                reject(err);
            }
            resolve(payload);
        });
    });
};
module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
