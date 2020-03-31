/**
 * ===========================
 * @author Terry Fung
 * @since 30-3-2020
 * ===========================
 */
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const logger = require("koa-logger");
const mongoose = require("mongoose");
const cors = require("koa2-cors");
const config = require("./config");

// Using Koa
const app = new Koa();

// Corss platform
app.use(cors(config.CORS_OPT));
app.use(logger());
app.use(bodyParser());
app.use(json());

// inport router controller file
const router = require("./api/routes/index");
app.use(router.routes());

// if server create success then connect the DB
app.listen(config.PORT, () => {
  // mogoDB connection
  mongoose.connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const db = mongoose.connection;
  db.on("error", err => {
    console.log(err);
    db.close();
  });

  console.log(`Server started on port ${config.PORT}`);
});

module.exports = app;
