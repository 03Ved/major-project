// setting up express router
const express = require("express"); 
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

// importing savReturnTo middleware
const {saveReturnTo} = require("../middleware");

// Importing user callbacks 
const userController = require("../controller/user.js");

router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLogin)
.post(saveReturnTo , passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;
