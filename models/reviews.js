// This file exports "Reviews" model

const mongoose = require("mongoose");
const { type } = require("../schemaValidation");

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,  
        required: true,
        maxLength: 50
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createwdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;