const createError = require("http-errors");
const joi = require("joi");
const { asyncWrapper } = require("../utils/asyncWrapper");
const { verifyAccessToken } = require("../services/jwt.service");

const userRegisterValidate = (data) => {
	const userRegisterSchema = joi.object({
		username: joi.string().alphanum().min(3).max(30).required(),
		email: joi.string().email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net", "vn", "edu", "gov"] },
		}),
		password: joi
			.string()
			.pattern(
				new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_]).{8,24}$")
			),
	});
	return userRegisterSchema.validate(data);
};

const userLoginValidate = (data) => {
	const userRegisterSchema = joi.object({
		username: joi.string().alphanum().min(3).max(30).required(),
		password: joi.string().pattern(
			new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_]).{8,24}$")
		),
	});
	return userRegisterSchema.validate(data);
};

const verifyUserToken = async (req, res, next) => {
	if (!req.headers.authorization) {
		return next(createError.Unauthorized("Token not found"));
	}
	const [decoded, err] = await asyncWrapper(
		verifyAccessToken(req.headers.authorization)
	);
	if (err) {
		return next(createError.Unauthorized(err.message));
	}
	req.payload = decoded;
	next();
};
module.exports = {
	userRegisterValidate,
	userLoginValidate,
	verifyUserToken,
};
