const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', `/upload/w_200`);
})
ImageSchema.virtual('cardImage').get(function () {
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop');
})

const opts = {toJSON : {virtuals : true}}

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
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
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, opts)


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc.reviews.length) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);