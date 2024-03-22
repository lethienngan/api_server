const express = require("express");
const { buy } = require("../controllers/Order.controller");
const route = express.Router();

route.get("/buy", buy);

module.exports = { route };
