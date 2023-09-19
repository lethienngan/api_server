require("dotenv").config();
const { google } = require("googleapis");

const clientId = process.env.GG_CLIENT_ID;
const clientSecrect = process.env.GG_CLIENT_SECRECT;
const redirectURI = process.env.GG_CLIENT_REDIRECT_URI;
const refreshToken = process.env.GG_REFRESH_TOKEN;
const scope = ["https://www.googleapis.com/auth/drive"];

const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecrect,
    redirectURI
);
oauth2Client.setCredentials({ refresh_token: refreshToken });

// Google Drive service
const driveService = google.drive({
    version: "v3",
    auth: oauth2Client,
});

module.exports = {
    driveService,
};
