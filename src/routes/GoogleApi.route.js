const express = require("express");
const {
    search,
    create,
    download,
    clientDownload,
} = require("../controllers/GoogleDrive.controller");

const route = express.Router();

// Create folder
route.post("/createFolder", create);
route.post("/search", search);
route.post("/download", download);
route.post("/client-download", clientDownload);
module.exports = { route };
