const { CampgroundSchema, ReviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campgrounds');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = CampgroundSchema.validate(req.body);
    // console.log(result);
    if (error) {
        const message = error.details.map(er => er.message).join(',');
        throw new ExpressError(message, 400);
    }
    else next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const findCamp = await Campground.findById(id);
    if(!findCamp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    // console.log(result);
    if (error) {
        const message = error.details.map(er => er.message).join(',');
        throw new ExpressError(message, 400);
    }
    else next();
}