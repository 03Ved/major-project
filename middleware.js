// This file exports the middleware functions that are used to check if a user is logged in or not.
const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

const saveReturnTo = (req, res, next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const {listingSchema} = require("./schemaValidation");
const ExpressError = require("./utils/ExpressError");
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, message);
    } else {
        next();
    }
}

const { reviewSchema} = require("./schemaValidation");
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let message = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, message);
    } else {
        next();
    }
}

const Listing = require("./models/listings.js");
const isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


const Review = require("./models/reviews");
const isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = {isLoggedIn, saveReturnTo, validateListing, validateReview, isOwner, isReviewAuthor};