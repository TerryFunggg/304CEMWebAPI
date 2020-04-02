/*
 * @author Terry Fung
 * @since 30-3-2020
 *
 */

const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const logger = require("koa-logger");
const mongoose = require("mongoose");
const cors = require("koa2-cors");
const error = require("./api/middleware/errorHandling");
const responseTime = require("./api/middleware/responseTime");
const config = require("./config");

/* ################################## */
/* Middleware                         */
/* ################################## */
app.use(logger());
app.use(error());
app.use(responseTime());
app.use(cors(config.CORS_OPT));
app.use(bodyParser());
app.use(json());

/* ################################## */
/* Router                             */
/* ################################## */
const router = require("./api/routes/index");
const userRouter = require("./api/routes/user");
app.use(router.routes()).use(router.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());

/* ################################## */
/* MongoDB setUp                      */
/* ################################## */
mongoose.connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", err => {
    console.log(err);
    db.close();
});

/* ################################## */
/* app listen                         */
/* ################################## */
app.listen(config.PORT);
console.log(`Server started on port ${config.PORT}`);

module.exports = app;
