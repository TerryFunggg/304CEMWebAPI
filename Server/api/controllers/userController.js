/**
 *  router controller function for user
 * -----
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:27:29 pm
 * -----
 */
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { message, hashPwd } = require("../helpers/index");
const config = require("../../config");

/**
 *  Register new user function
 *  It will using bcrypt to hash the user password,
 *  After that insert new User in DB
 *  @returns 201 Created status
 *  @throws 409 - ConflictError
 */
exports.user_register = async (ctx, next) => {
  let body = ctx.request.body;
  const user = await User.find({ email: body.email });
  if (user.length >= 1) {
    // email already exit in DB
    ctx.status = 409;
    ctx.body = message("email already exits", -1);
    next();
  } else {
    // create new user
    const { email, name, password } = ctx.request.body;
    const newUser = new User({ email, name, password });
    const hash = await hashPwd(password);
    newUser.password = hash;
    try {
      const result = await newUser.save();
      ctx.status = 201;
      ctx.body = message("User Created", 0);
      next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = message("Can not create user.", -1);
    }
  }

  //const user = new User({ email, name, password });

  // // hash password to user
  // bcrypt.genSalt(10, (err, salt) => {
  // bcrypt.hash(user.password, salt, async (err, hash) => {
  //     if (err) return next(new errors.InternalError(err.message));
  //     user.password = hash;
  //     try {
  //       // Save user
  //       const newUser = await user.save();
  //       res.send(201, { newUser });
  //       next();
  //     } catch (err) {
  //       return next(new errors.ConflictError(err.message)); // 409 status
  //     }
  //});
  // });
};

/**
 *  User Login function
 *  It will check the password in auth.authenticate using bcryptjs,
 *  If success , it will create and return JWT to client
 * @returns iat,exp,token
 * @throws UnauthorizedError 401
 */
exports.user_login = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  try {
    const user = await auth.authenticate(email, password);

    // Create JWT and send to the client
    const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
      expiresIn: "1d"
    });
    const { iat, exp } = jwt.decode(token);
    ctx.status = 200;
    ctx.body = {
      iat,
      exp,
      token,
      code: 0
    };
    next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = message(err, -1);
    next(false);
  }
};
