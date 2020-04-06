/*
 * User Model
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:27:42 pm
 */
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        type: String,
    },
    userType: {
        type: Number, // 0: admin 1:user
        default: 1,
    },
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
