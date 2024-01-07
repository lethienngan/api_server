const createError = require("http-errors");
const { userRegisterValidate, userLoginValidate } = require("../middlewares/userController.middleware");
const userModel = require("../models/Users.model");
const { hashPwd, comparePwd } = require("../services/pwdHandler.service");
const { asyncWrapper } = require("../utils/asyncHandler");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../services/jwt.service");
const { redisClient } = require("../configs/redis.config");

const userRegister = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Validate client data
        const { error } = userRegisterValidate(req.body);
        if (error) {
            return next(createError(error.details[0].message));
        }

        // Check duplicated user
        const isExist = await userModel.findOne({
            $or: [{ username: username }, { email: email }],
        });
        if (isExist) {
            if (isExist?.username === username) {
                return next(createError.Conflict(`Username: "${username}" is already registered`));
            } else if (isExist?.email === email) {
                return next(createError.Conflict(`Email: "${email}" is already registered`));
            }
        }

        // Hash pwd
        const hashedPwd = await hashPwd(password);

        // Create user
        const isCreated = await userModel.create({
            username,
            email,
            password: hashedPwd,
        });

        return res.json({
            status: "OK",
            response: {
                msg: "Account is created",
                userId: isCreated.id,
                username: isCreated.username,
                email: isCreated.email,
            },
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
const userLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate client data
        // const { error } = userLoginValidate(req.body);
        // if (error) {
        // 	return next(createError(error.details[0].message));
        // }

        // Check username is correct
        const user = await userModel.findOne({ username });
        if (!user) {
            return next(createError.NotFound(`User: ${username} is not found`));
        }
        // Check password
        const isMatch = await comparePwd(password, user.password);
        if (!isMatch) {
            return next(createError.Unauthorized(`Password is not correct`));
        }

        // Assign access & refresh Token
        const [accessToken, errAccessToken] = await asyncWrapper(signAccessToken(user.id));
        const [refreshToken, errRefreshToken] = await asyncWrapper(signRefreshToken(user.id));
        if (errAccessToken || errRefreshToken) {
            next(createError.InternalServerError(`Cannot create user's Token`));
            throw new Error(errAccessToken || errRefreshToken);
        }

        // Set redis user refesh token
        await redisClient.set(user.id, refreshToken, {
            EX: 60 * 60 * 24,
        });
        // Set Cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
        });
        return res.status(200).json({
            status: "OK",
            userId: user.id,
            username: user.username,
            email: user.email,
            accessToken: accessToken,
            refreshToken: "stored in browser cookie",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
const userLogout = async (req, res, next) => {
    console.log(req.cookies);
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw createError.BadRequest();
        }

        // Verify refresh Token
        const [payload, verifyErr] = await asyncWrapper(verifyRefreshToken(refreshToken));
        if (verifyErr) {
            next(createError.InternalServerError(verifyErr.message));
            throw new Error(verifyErr);
        }

        // Delete user's redis_token
        const isDeleted = await redisClient.del(payload?.userId);
        if (isDeleted === 0) {
            throw createError.InternalServerError(`Delete user's redis_token: FAILED`);
        }
        // clear browser cookies
        res.clearCookie("refreshToken");
        return res.status(200).json({
            status: isDeleted,
            msg: "logged out",
        });
    } catch (error) {
        next(error);
    }
};
const userRefreshToken = async (req, res, next) => {
    console.log(req.cookies);
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) throw createError.BadRequest("Refresh Token not found");

        // Verify refresh Token
        const [payload, verifyErr] = await asyncWrapper(verifyRefreshToken(refreshToken));
        if (verifyErr) {
            next(createError.InternalServerError(verifyErr.message));
            throw new Error(verifyErr);
        }

        // Compare to redis_token
        const redisToken = await redisClient.get(payload?.userId);

        if (redisToken === null) {
            next(createError.InternalServerError("redis token not found"));
            throw new Error("redis token not found");
        }
        if (refreshToken !== redisToken) {
            next(createError.Unauthorized(`user's refresh token does not match`));
            throw new Error(`user refresh token does not match`);
        }

        // Assign new access & refresh Token
        const [newAccessToken, accessError] = await asyncWrapper(signAccessToken(payload?.userId));
        const [newRefreshToken, refreshError] = await asyncWrapper(signRefreshToken(payload?.userId));
        if (accessError || refreshError) {
            next(createError.InternalServerError(`Cannot assign new token for user`));
            throw new Error(accessError || refreshError);
        }

        // Redis set user's newRefreshToken
        const result = await redisClient.set(payload?.userId, newRefreshToken, {
            EX: 60 * 60 * 24,
        });

        if (result !== "OK") {
            next(createError.InternalServerError(`Cannot set redis refresh token`));
            throw new Error(redisSetError);
        }
        // Set Cookies
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "strict",
        });
        return res.status(200).json({ newAccessToken, newRefreshToken: "stored in browser" });
    } catch (error) {
        // next(error);
    }
};
const userComparePwd = async (req, res, next) => {
    try {
        const userPwd = await userModel.findOne({ email: req.body.email });
        const result = await comparePwd(req.body.password, userPwd.password);
        return res.status(200).json({
            status: "OK",
            comparedPwd: result,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
module.exports = {
    userRegister,
    userComparePwd,
    userLogin,
    userLogout,
    userRefreshToken,
};
