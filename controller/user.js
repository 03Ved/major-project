// Importing 'User' model
const User = require("../models/users.js");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const newUSer = new User({email, username});
        let registeredUser = await User.register(newUSer, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", `Welcome to Wonderlust @${username}!`);
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res, next) => {
    // let {username} = req.body;
    req.flash("success", `Welcome back ${req.user.username}!`);
    res.redirect(res.locals.returnTo || "/listings");
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}