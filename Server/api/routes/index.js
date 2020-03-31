/*
 * -----
 * User router
 * @author: Terry Fung
 * @since: Monday, 30th March 2020 10:24:41 pm
 * -----
 */
const Router = require("koa-router");
const router = new Router({
  prefix: "/api"
});

/*---------------------
    Inport Controller
----------------------*/
const UserController = require("../controllers/userController");

/*---------------------
    Router
----------------------*/
// User
router.post("/register", UserController.user_register);
router.post("/login", UserController.user_login);

// TODO Movie

// TODO comment

// TODO Order

module.exports = router;
