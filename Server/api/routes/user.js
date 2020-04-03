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
router.post("/register", validateUser.validate, UserController.user_register);
router.post("/login", validateUser.validate, UserController.user_login);

module.exports = router;
