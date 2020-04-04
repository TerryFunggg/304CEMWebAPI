/*
 *  router controller function for user
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:27:29 pm
 */

const users = require("../models/user");
const { createToken, message } = require("../helpers/index");

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
        const user = await users.add(ctx.request.body);
        ctx.status = 201;
        ctx.body = message("User Created", 0);
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
        const user = await users.authenticate(email, password);
        // Create JWT and send to the client
        const token = createToken(user);
        // Send response to client
        ctx.status = 200;
        ctx.body = { token, code: 0 };
    } catch (err) {
        return errors.throws(err, ctx);
    }
};
