const express = require("express");
const route = express.Router();

// Sample Server-Sent-Event
route.get("/subscribe", (req, res, next) => {
    try {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache",
        });
        // Send msg to confirm connection
        // res.write("Connected");
        // res.write(`Time: ${new Date()}`);

        // Send msg frequently
        setInterval(() => {
            res.write(`New msg at: ${new Date()}`);
        }, 2000);

        res.on("close", () => res.status(200).send("OK"));
    } catch (err) {
        console.log(err);
    }
});

module.exports = { route };
