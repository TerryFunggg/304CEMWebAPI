/*
 *  router controller function for user
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:27:29 pm
 */

const User = require("../models/User");
const {
    createToken,
    message,
    comparePwd,
    hashPwd,
} = require("../helpers/index");

const errors = require("../helpers/errors");

/**
 *  Register new user function
 *  It will using bcrypt to hash the user password,
 *  After that insert new User in DB
 *  @returns 201 Created status
 *  @throws 409 - ConflictError
 */
exports.user_register = async (ctx, next) => {
    try {
        const user = await add(ctx.request.body);
        ctx.status = 201;
        ctx.body = message("User Created", 0);
        next();
    } catch (err) {
        return errors.throws(err, ctx);
    }
};

/**
 *  User Login function
 *  It will check the password in users.authenticate using bcryptjs,
 *  If success , it will create and return JWT to client
 * @returns token
 * @throws UnauthorizedError 401
 */
exports.user_login = async (ctx, next) => {
    try {
        const { email, password } = ctx.request.body;
        const user = await authenticate(email, password);
        // Create JWT and send to the client
        const token = createToken(user);
        // Send response to client
        ctx.status = 200;
        ctx.body = { token, code: 0 };
        next();
    } catch (err) {
        return errors.throws(err, ctx);
    }
};

/**
 *  Authentication of User login.
 * @param {String} email user email
 * @param {String} password user password
 * @returns user
 */
function authenticate(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email }); // Get user by email
            await comparePwd(password, user.password);
            resolve(user); // if success, then return user.
        } catch (err) {
            reject(new errors.ConfirmationError());
        }
    });
}

/**
 *  add user to DB
 * @param {any} user
 */
async function add(user) {
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
        return new errors.InternalServerError();
    }
}
