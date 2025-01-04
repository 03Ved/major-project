// This file exports "User" model

const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 10
    }
});

// pluggin passportLocalMongoose to userSchema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;

// all users and their passwrods:
// Micheal: gtaV 
// Franklin: Chop 
// Trevor: sandyShores