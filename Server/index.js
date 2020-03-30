/**
 * ===========================
 * This is a movie booking api server implemented by restful api style
 * The system is using restify api framwork.
 * @author Terry Fung
 * @since 30-3-2020
 * ===========================
 */
const restify = require("restify");
const mongoose = require("mongoose"); // using mongoDB
const config = require("./config"); // config file

const server = restify.createServer();

server.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true });
});

const db = mongoose.connection;
db.on("error", err => console.log(err));
db.once("open", () => {
  require();
});
