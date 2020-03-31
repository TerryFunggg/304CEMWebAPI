/**
 * -----
 * Authorization using bcryptjs to compare the password
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:27:22 pm
 * -----
 */

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email }); // Get user by email
      bcrypt.compare(password, user.password, (err, match) => {
        // Chaeck password
        if (err) throw err;
        if (match) {
          resolve(user);
        } else {
          reject("Password not match"); // the password don't match
        }
      });
    } catch (err) {
      reject("email not found"); // Email not found
    }
  });
};
