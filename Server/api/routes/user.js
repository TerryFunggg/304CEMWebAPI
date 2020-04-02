const Router = require("koa-router");
const validateUser = require("../middleware/validateUser");
const router = new Router();
/*---------------------
    Inport Controller
----------------------*/
const UserController = require("../controllers/userController");
/*---------------------
    Router
----------------------*/
router.post(
    "/register",
    validateUser.validateAuth,
    UserController.user_register
);
router.post("/login", validateUser.validateLogin, UserController.user_login);

module.exports = router;
