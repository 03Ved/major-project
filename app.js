// setting dotenv for environment variables
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// setting up for express
const express = require("express"); 
const app = express();
const port = 8080;

// exporting error handling function and class
const ExpressError = require("./utils/ExpressError");

//setting up paths for templates
const path = require("path");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// for using patch, put and delete requests
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

// setting up for mongoose
const mongoose = require("mongoose");
const dburl = process.env.ATLASDB_URI;

mongoose.connect(dburl)
.then(res => console.log("Mongoose Database Connected!"))
.catch(err => console.log(err));

// setting up session 
const session = require("express-session");
const MongoStore = require('connect-mongo');

const store =  MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", function(e) {
    console.log("Session Store Error", e);
});

const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));

// setting up flash
const flash = require("connect-flash");

app.use(flash());

// setting up passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash messages
app.use((req, res, next) => {   
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // req.user will be undefined if this line is set before passport.session()
    next();
});

// importing routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

// using routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// // Middleware for handling errors
// app.all("*", (req, res, next) => {
//     next(new ExpressError("Page Not Found", 404));
// });

// Define a route for the root URL
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
});

// setting up port
app.listen(port, () => {
    console.log(`Port ${port} is listening`);
});