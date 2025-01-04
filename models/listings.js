// This file exports "Listing" model

const { allow } = require("joi");
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    image: {
        url: {
            type: String
        },
        filename: {
            type: String
        }
    },
    price: {
        type: Number,
        allowNull: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category: {
        type: [String],
        enum: ["Trending", "Lake", "Mountains", "Camping", "Forest", "Snow", "Cities", "Foreign", "Landmarks", "Nature", "Boating", "Luxury", "Castle"]
    }
});

// Mongoose middleware for handeling listing deletions
listingSchema.post("findOneAndDelete", async (listing) => { 
    if (listing.reviews.length) {
        const Review = require("./reviews");
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

// const categories = ["Trending", "Lake", "Mountains", "Camping", "Forest", "Snow", "Cities", "Foreign", "Landmarks", "Nature", "Boating", "Luxury", "Castle"];

// function getRandomCategories() {
//     const shuffled = categories.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, 3);
// }

// listingSchema.pre('save', function(next) {
//     if (!this.category || this.category.length === 0) {
//         this.category = getRandomCategories();
//     }
//     next();
// });