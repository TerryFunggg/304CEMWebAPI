const bcrypt = require("bcryptjs");

module.exports = password => {
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
};
