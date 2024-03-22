const express = require("express");
const {
    search,
    create,
    download,
    clientDownload,
    clientUpload,
} = require("../controllers/GoogleDrive.controller");
const { upload } = require("../configs/multer.config");

const route = express.Router();

// Create folder
route.post("/createFolder", create);

route.post("/search", search);

route.post("/download", download);

route.post("/client-download", clientDownload);

route.post("/client-upload", upload.single("file"), clientUpload);

module.exports = { route };
