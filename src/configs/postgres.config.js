const { Pool } = require("pg");

require("dotenv").config();
const config = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DBNAME,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PWD,
};
const pg = new Pool(config);

pg.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

pg.connect()
    .then(() => console.log("PG is connected"))
    .catch((err) => console.log("PG connection error: ", err));

module.exports = { pg };
