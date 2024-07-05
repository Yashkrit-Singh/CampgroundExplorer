const Basejoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = Basejoi.extend(extension);

module.exports.CampgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        // image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required(),
    }).required(),
    deleteImages: joi.array()
})


module.exports.ReviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
    }).required()
})

