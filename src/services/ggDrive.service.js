const fs = require("fs");
const { driveService } = require("../configs/google.config");
const { Stream } = require("stream");

const createFile = (fileStream, dest) => {
    return new Promise((resolve, reject) => {
        fileStream
            .on("end", () => resolve())
            .on("error", () => reject("Failed to create file !"))
            .pipe(dest);
    });
};
const ggDriveDownloadFile = (id) => {
    return driveService.files.get(
        {
            fileId: id.toString(),
            alt: "media",
        },
        { responseType: "stream" }
    );
};
const ggDriveUploadFile = (file, parent) => {
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);
    return driveService.files.create({
        requestBody: {
            name: file.originalname,
            parents: [parent],
        },
        media: {
            mimeType: file.mimetype,
            body: bufferStream,
        },
        fields: "id",
    });
};
module.exports = { createFile, ggDriveDownloadFile, ggDriveUploadFile };
