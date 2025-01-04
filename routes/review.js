// setting up express router
const express = require("express"); 
const router = express.Router({mergeParams: true}); 

// exporting error handling function and class
const wrapAsync = require("../utils/wrapAsync");

// Importing "User" model
const User = require("../models/users");

// requiring middlewares
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

// importing review callbacks
const reviewController = require("../controller/review.js");

// Posting Reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

// Deleting Reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;