// Setting up Mapbox
const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const { deleteImage } = require("../cloudConfig");

// Importing "Listing" model
const Listing = require("../models/listings.js");

// exporting error handling function and class
const ExpressError = require("../utils/ExpressError");

module.exports.renderHomepage = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/home.ejs", {allListings});
}

module.exports.renderNewListing = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req, res, next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: `${req.body.newListing.location}, ${req.body.newListing.country}`,
        limit: 1
      })
    .send()

    let url = req.file.path
    let filename = req.file.filename

    let newListing = req.body.newListing;
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;

    await Listing.insertMany(newListing);
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
}

module.exports.showListings = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {listing});
}

module.exports.renderEditListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing not available to edit!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.editListing = async (req, res) => {
    if(!req.body.newListing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    let {id} = req.params;

    if(typeof req.file !== "undefined") {
        let editListing = await Listing.findById(id); // for deleting the old image from cloud server
        let publicId = editListing.image.filename;
        deleteImage(publicId);
    }

    let newListing = req.body.newListing;

    let response = await geocodingClient
    .forwardGeocode({
        query: `${req.body.newListing.location}, ${req.body.newListing.country}`,
        limit: 1
      })
    .send()
    newListing.geometry = response.body.features[0].geometry;

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};
    }

    let updatedListing = await Listing.findByIdAndUpdate(id, newListing, {runValidators: true});

    req.flash("success", "Listing edited successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;

    let delListing = await Listing.findById(id); // for deleting the image from cloud server
    let publicId = delListing.image.filename;
    deleteImage(publicId);

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}

module.exports.searchListing = async (req, res) => {
    let Title = req.query.searchQuery;
    let listing = await Listing.findOne({title: Title}).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.categoryFilter = async (req, res) => {
    let {filter} = req.params;
    let filteredListings = await Listing.find({category: filter});
    if(filteredListings.length === 0) {
        req.flash("error", "No listings found for this category!");
        return res.redirect("/listings");
    }
    res.render("listings/home.ejs", {allListings: filteredListings});
}

module.exports.confirmBooking = (req, res) => {
    let {id} = req.params;
    req.flash("success", "Booking successful! Thanks for visting :)");
    res.redirect(`/listings/${id}`);
}
