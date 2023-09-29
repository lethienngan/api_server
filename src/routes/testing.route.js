const route = require("express").Router();

route.post(
    "/locals",
    (req, res, next) => {
        req.person = "John Cena";
        req.locals = req.body;
        next();
    },
    (req, res) => {
        try {
            console.log(req.person);
            console.log(req.locals);
            return res.status(200).json("OK");
        } catch (error) {
            console.log(error);
        }
    }
);

module.exports = { route };
