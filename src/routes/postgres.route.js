const { injection, getData } = require("../controllers/SQL.controller");

const route = require("express").Router();

route.post("/injection", injection);
route.get("/getData", getData);

module.exports = { route };
