const multer = require("multer");
const upload = multer({
    // storage: multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, `${__dirname}`);
    //     },
    //     filename: function (req, file, cb) {
    //         cb(
    //             null,
    //             file.fieldname + "_" + Date.now() + "_" + file.originalname
    //         );
    //     },
    // }),
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

module.exports = { upload };
