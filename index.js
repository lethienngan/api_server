// const cluster = require("cluster");
// const os = require("os");
// const cpuCount = os.cpus().length;

// cluster.setupPrimary({
//     exec: __dirname + "/src/server.js",
// });

// // if (cluster.isPrimary) {
//     console.log("Number of CPUS: ", cpuCount);
//     console.log("Cluster Master: ", cluster.isPrimary);
//     os.cpus().forEach((cpuInfo, index) => {
//         console.log("Create Cluster with CPU: ", cpuInfo);
//         cluster.fork();
//     });
// // }

// cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} has been killed`);
//     console.log(`Starting another worker`);
//     cluster.default.fork();
// });

