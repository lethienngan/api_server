const express = require("express");
const route = express.Router();
const createError = require("http-errors");
const {
    userRegister,
    userComparePwd,
    userLogin,
    userRefreshToken,
    userLogout,
} = require("../controllers/User.controller");
const { asyncFetchWrapper } = require("../utils/asyncHandler");
const { verifyUserToken } = require("../middlewares/userController.middleware");

// Get list of users
route.post("/", async (req, res, next) => {
    console.log(req.body);
    try {
        const [data, error] = await asyncFetchWrapper("https://jsonplaceholder.typicode.com/posts");
        if (error) {
            throw createError.InternalServerError();
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

// Register
route.post("/register", userRegister);

// Login
route.post("/login", userLogin);

// Refresh Token
route.get("/refresh-token", userRefreshToken);

// Logout
route.delete("/logout", userLogout);

// Compare password
route.post("/compare", userComparePwd);

//
route.get("/getList", verifyUserToken, async (req, res, next) => {
    try {
        // if verify AccessToken is success
        const [data, error] = await asyncFetchWrapper("https://jsonplaceholder.typicode.com/users");
        if (error) {
            throw createError.InternalServerError();
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

module.exports = { route };
