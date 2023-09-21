const { driveService } = require("../configs/google.config");

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
module.exports = { createFile, ggDriveDownloadFile };
