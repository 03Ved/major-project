// setting up express router
const express = require("express"); 
const router = express.Router({mergeParams: true});

// setting multer for uploading files
const multer  = require('multer')
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// importing error handling function and class
const wrapAsync = require("../utils/wrapAsync");

// requiring middlewares
const {isLoggedIn, isOwner, validateListing} = require("../middleware");

// importing listing callbacks
const listingController = require("../controller/listing.js");

router.route("/")
.get(wrapAsync(listingController.renderHomepage))
.post(isLoggedIn, upload.single('newListing[image]'), validateListing, wrapAsync(listingController.createNewListing));

// Creating new listing
router.get("/new", isLoggedIn, listingController.renderNewListing );

// Search
router.get("/search", listingController.searchListing);

// Booking confirmation
router.get("/:id/booking", listingController.confirmBooking);

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(upload.single('newListing[image]'), validateListing, wrapAsync(listingController.editListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Editing a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditListing));

// Filtering Listings category-wise
router.get("/category/:filter", listingController.categoryFilter);

module.exports = router;