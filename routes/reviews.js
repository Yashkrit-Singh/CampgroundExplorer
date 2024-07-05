const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campgrounds');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const { createNewReview, DeleteReview } = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(createNewReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(DeleteReview))

module.exports = router;