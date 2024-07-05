const express = require('express');
const router = express.Router();
const Campground = require('../models/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isAuthor, storeReturnTo} = require('../middleware');
// const { index, postNewCampground, showCampground, EditCampgroundPage, PutRequest_EditCampground, DeleteCampgrounds } = require('../controllers/campgrounds');
// do above one or below one 
const campground = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary/index');

const upload = multer({storage : storage});

router.route('/')        // group all the request routes together with path '/'
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'),  validateCampground, catchAsync(campground.createCampground))
    // .post(upload.array('campground[image]'), (req, res) => {    // just to see file is being console or not
    //     console.log(req.files);
    // })

    // /new shouldn't be below id -> as it will destroy the order of search path (id will be considered as new then)
router.get('/new', isLoggedIn , campground.renderNewForm);

router.route('/:id')    // group all the request routes together with path '/:id'
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.UpdateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.DeleteCampgrounds))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.RenderEditForm))



module.exports = router;