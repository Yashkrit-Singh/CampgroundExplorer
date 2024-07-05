const Campground = require('../models/campgrounds');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    let { page = 1, limit = 10, state , campground } = req.query;

    // Convert page and limit to numbers
    page = Number(page);
    limit = Number(limit);

    // Build the query object dynamically
    const queryObject = {};
    if (state && state !== "All State") {
        queryObject.location = { $regex: state, $options: 'i' };
    }

    if (campground) {
        queryObject.title = { $regex: campground, $options: 'i' }; // Use regex for case-insensitive search
    }

    // Count total campgrounds that match the query
    const totalCampgrounds = await Campground.countDocuments(queryObject);
    const totalPages = Math.ceil(totalCampgrounds / limit);

    if ((page > totalPages && totalPages > 0) || (page <= 0)) {
        req.flash('error', 'No content available for selected page');
        return res.redirect(`/campgrounds?page=${1}&limit=${limit}`);
    }

    // Fetch campgrounds with pagination
    let campgrounds = await Campground.find(queryObject)
        .skip((page - 1) * limit)
        .limit(limit);

    res.render('campgrounds/index', { campgrounds, totalPages, currentPage: page, limit, state, campground });
}



module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    console.log(req.files);
    // const imgs = req.files.map(f => ({url : f.path, filename: f.filename}))
    // campground.images.push(...imgs);
    // Above or below any choose
    for (let file of req.files) {
        campground.images.push({ url: file.path, filename: file.filename });
    }

    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const findCampground = await Campground.findById(id).populate({path : 'reviews', populate: { path : 'author' }}).populate('author');
    // console.log(findCampground);
    if (!findCampground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/show', { findCampground });
}

module.exports.RenderEditForm = async (req, res) => {
    const { id } = req.params;
    const findCampground = await Campground.findById(id);
    if (!findCampground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect(`/campgrounds`);
    }
    res.render('campgrounds/edit', { findCampground });
}

module.exports.UpdateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({url : f.path, filename: f.filename}))
    campground.images.push(...imgs);
    console.log(campground);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);   // delete from cloudinary
        }
        await campground.updateOne({$pull : { images : {filename : { $in : req.body.deleteImages }}}})
    }    // pull out all images having filename which are under deleteImages array
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.DeleteCampgrounds = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}