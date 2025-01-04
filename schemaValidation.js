const Joi = require("joi");

const listingSchema = Joi.object({
    newListing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required().min(10),
        image: Joi.object(),
        price: Joi.number().allow("", null).default(500).min(0),
        country: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.array().items(Joi.string()),
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required().max(50),
        rating: Joi.number().required().min(1).max(5),
        createwdAt: Joi.date().default(Date.now())
    }).required()
});

module.exports = {listingSchema, reviewSchema};