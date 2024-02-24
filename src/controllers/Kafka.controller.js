const { model } = require("mongoose");
const { client } = require("../services/kafka.service");

const kafkaProducer = async (req, res, next) => {
    console.log("Trigger Kafka Producer")
    try {
        const producer = client.producer();
        await producer.connect();
        const result = await producer.send({
            topic: "new_topic_1",
            messages: ["This is message"],
        });
        console.log(result)
    } catch (err) {
        console.log(err);
    }
};

module.exports = { kafkaProducer };
