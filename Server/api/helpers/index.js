/*
 * -----
 * @author: Terry Fung
 * @since: Wednesday, 1st April 2020 12:20:26 am
 * -----
 */
const bcrypt = require("bcryptjs");

/**
 *  Return some simple message to client
 * @param {String} message message string
 * @param {Number} code code number 0: ok , -1: faile
 */
function message(message, code) {
    return {
        message,
        code
    };
}

/**
 *  A function of hashing user password
 * @param {String} password message string
 * @returns  hash password
 */
function hashPwd(password) {
    return new Promise(async (resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) throw err;
            if (hash) {
                resolve(hash);
            } else {
                reject("Can't not hash password");
            }
        });
    });
}

/**
 *  Check the the email is validate eemail
 * @param {String} email message string
 * @returns Boolean
 */
function isEmail(email) {
    if (email) {
        return (
            email.match(
                /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
            ) != null
        );
    }
    return false;
}

module.exports = {
    message,
    hashPwd,
    isEmail
};
