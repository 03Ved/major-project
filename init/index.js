// setting up for mongoose
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
.then(res => console.log("Mongoose Database Connected!"))
.catch(err => console.log(err));

//importing data and schema of listings
const initdata = require("./data");
const Listing = require("../models/listings.js");

const { deleteBeforeInit } = require("../cloudConfig.js");

const initDB = async () => {
    // await deleteBeforeInit();
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
};

initDB();