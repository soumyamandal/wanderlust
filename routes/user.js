const express = require("express");
const router = express.Router();

const passport = require("passport");
const userController = require("../controllers/users.js");

// SIGNUP
router.route("/signup")
    .get(userController.signupForm)
    .post(userController.createUser);

// LOGIN
router.route("/login")
    .get(userController.loginUser)
    .post(
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.AfterLogin
    );

// LOGOUT
router.get("/logout", userController.userLogout);

module.exports = router;