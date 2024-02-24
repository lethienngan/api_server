const { Kafka } = require("kafkajs");

const client = new Kafka({
    clientId: "my-app",
    brokers: ["172.21.84.4:9092"],
    
});

module.exports = { client };
