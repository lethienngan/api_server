const schedule = require("node-schedule");

// execute every 2 second
const job1 = schedule.scheduleJob("0/2 * * * * *", (e) => {
    console.log("At:", e);
});
