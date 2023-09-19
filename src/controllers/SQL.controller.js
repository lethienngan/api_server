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

        return result
            ? res.status(200).json(result)
            : next(createError.NotFound(`User ${username} not found`));
    } catch (error) {
        next(createError.InternalServerError(error));
    }
};

module.exports = { injection };
