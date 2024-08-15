const { poolClassicModels } = require("../configs/mysql.config");
const { pg } = require("../configs/postgres.config");

const createError = require("http-errors");
const injection = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        // Query by text only -> injection attack
        // const result = await pg.query(queryString).then((res) => res.rows);

        // Query using params [text, value] -> avoid injection attack
        const result = await pg
            .query({
                text: "SELECT * FROM users where username=$1 and password=$2",

                values: [username, password],
            })
            .then((res) => res.rows[0]);

        return result ? res.status(200).json(result) : next(createError.NotFound(`User ${username} not found`));
    } catch (error) {
        next(createError.InternalServerError(error));
    }
};

const getData = async (req, res, next) => {
    try {
        const [result, field] = await poolClassicModels.execute("SELECT * FROM customers").catch((err) => {
            throw err;
        });
        return res.status(200).json({
            msg: "OK",
            dataLenght: result.length,
            data: result,
        });
    } catch (error) {
        next(createError.InternalServerError(error));
    }
};
module.exports = { injection, getData };
