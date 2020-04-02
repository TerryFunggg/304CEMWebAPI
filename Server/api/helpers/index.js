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
 * @returns {Promise} hash
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

function add(a, b) {
    return a + b;
}

module.exports = {
    message,
    hashPwd,
    add
};
