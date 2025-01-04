// Importing "Listing" model
const Listing = require("../models/listings.js");

// Importing "Review" model
const Review = require("../models/reviews");

module.exports.postReview = async (req, res) => {
    let {id} = req.params;
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review added!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}