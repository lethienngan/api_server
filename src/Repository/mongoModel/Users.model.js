const mongoose = require("mongoose");
const { mongoLocal } = require("../../configs/mongodb.config");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        uniquie: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
});
const userModel = mongoLocal.model("user", UserSchema);
module.exports = { userModel };
