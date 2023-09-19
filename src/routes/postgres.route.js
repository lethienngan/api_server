const { injection } = require("../controllers/SQL.controller");

const route = require("express").Router();

route.post("/injection", injection);

module.exports = { route };
