/**
 * -----
 * config.js
 * System config file
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:07:54 pm
 * -----
 */

module.exports = {
  ENV: process.Node_ENV || "development",
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  MONGODB_URI: process.MONGODB_URI || "mongodb://localhost/movie_booking_api",
  JWT_SECRET: process.env.JWT_SECRET || "justexampleforassignment",
  CORS_OPT: {
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization", "Date"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE", "PUT"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"]
  }
};
