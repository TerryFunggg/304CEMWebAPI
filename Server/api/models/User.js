/*
 * User Model
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:27:42 pm
 */

const User = require("../db/User");
const errors = require("../helpers/errors");
const { comparePwd, hashPwd } = require("../helpers/index");

/**
 *  Authentication of User login.
 * @param {String} email user email
 * @param {String} password user password
 * @returns user
 */
exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email }); // Get user by email
            await comparePwd(password, user.password);
            resolve(user); // if success, then return user.
        } catch (err) {
            reject(new errors.ConfirmationError());
        }
    });
};

/**
 *  add user to DB
 * @param {any} user
 */
exports.add = async (user) => {
    const { email, password, name } = user;

    //Check email duplicate
    const getUser = await User.find({ email });
    if (getUser.length >= 1) {
        throw new errors.ItemAlreadyExistsError();
    }
    // create new user
    try {
        const newUser = new User({ email, name, password });
        const hash = await hashPwd(newUser.password);
        newUser.password = hash;
        await newUser.save();
    } catch (err) {
        return errors.throws(err, ctx);
    }
};
