const createHttpError = require("http-errors");
const { v4: uuid } = require("uuid");
const { logEvents } = require("../utils/logEvents");

const invalidPathHandler = () => {
    return (req, res, next) => {
        next(createHttpError.NotFound("URL not found"));
    };
};
const ErrorHandler = () => {
    return (err, req, res, next) => {
        console.log(err.message);
        logEvents(`logId: ${uuid()} --- ${req.url} --- ${req.method} --- ${err.message}`);
        res.status(err.status || 500).json({
            from: "ErrorHandler",
            status: err.status || 500,
            message: err.message,
        });
    };
};

module.exports = {
    ErrorHandler,
    invalidPathHandler,
};
