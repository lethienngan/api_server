const express = require("express");
const { kafkaProducer } = require("../controllers/Kafka.controller");

const route = express.Router();

// Trigger Kafka Producer
route.post("/producer", kafkaProducer);

module.exports = { route };
