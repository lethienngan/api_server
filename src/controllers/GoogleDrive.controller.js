const createError = require("http-errors");
const fs = require("fs");
const path = require("path");
const { driveService } = require("../configs/google.config");
const {
    createFile,
    ggDriveDownloadFile,
    ggDriveUploadFile,
} = require("../services/ggDrive.service");
const { asyncWrapper } = require("../utils/asyncHandler");

// Test folder id (parent folder): 1B0uxNwOp54TlLy_gCVuG7YBVDO3zC6x1
const parent = "1B0uxNwOp54TlLy_gCVuG7YBVDO3zC6x1";
const create = async (req, res, next) => {
    try {
        await driveService.files.emptyTrash();
        const folder_metaData = {
            name: "Child Folder",
            mimeType: "application/vnd.google-apps.folder",
            parents: [parent],
        };
        const file_metaData = {
            name: "pic.jpeg",
            parents: [parent],
        };
        const result = await driveService.files
            .create({
                resource: file_metaData,
            })
            .then((res) => res?.data);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
    }
};
const search = async (req, res, next) => {
    try {
        const { fileId } = req.body;
        if (!fileId) {
            return next(createError.BadRequest("fileId not found"));
        }
        const result = await driveService.files
            .get({
                fileId: fileId,
            })
            .then((res) => res?.data);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
    }
};
const download = async (req, res, next) => {
    try {
        const dest = fs.createWriteStream(
            path.join(__dirname, `${Math.random()}.pdf`)
        );
        await driveService.files.emptyTrash();
        const fileStream = await driveService.files
            .get(
                {
                    fileId: "1A9hik3Ygd9dscr1e247Lfqr6OB99gqaS",
                    alt: "media",
                },
                { responseType: "stream" }
            )
            .then((res) => res?.data);

        await createFile(fileStream, dest);

        return res.status(200).json(dest.path);
    } catch (error) {
        console.log(error);
    }
};
// Sample fileId: "1A9hik3Ygd9dscr1e247Lfqr6OB99gqaS"
const clientDownload = async (req, res, next) => {
    try {
        const { fileId } = req.body;
        if (!fileId) return next(createError.BadRequest("fileId not found !"));

        // Get file's metaData
        const metaData = await driveService.files
            .get({
                fileId: fileId.toString(),
            })
            .then((res) => res?.data?.name);

        // Get file and stream to client
        const [file, error] = await asyncWrapper(ggDriveDownloadFile(fileId));
        if (error)
            return next(createError.InternalServerError(`File Not Found !`));

        const fileData = file.data;
        const fileType = file.headers["content-type"];

        res.set("Content-Type", fileType);
        return fileData.pipe(res);
    } catch (error) {
        console.log(error);
    }
};
const clientUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(createError.BadRequest("No file uploaded"));
        }
        const [result, error] = await asyncWrapper(
            ggDriveUploadFile(req.file, parent)
        );
        if (error) {
            console.log(error);
            return next(
                createError.InternalServerError(`Cannot upload file !`)
            );
        }
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err);
    }
};
module.exports = { create, search, download, clientDownload, clientUpload };
