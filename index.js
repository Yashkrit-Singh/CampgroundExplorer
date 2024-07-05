if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp_Campground')
    .then(() => {
        console.log("Connection Open");
    }).catch((e) => {
        console.log("ERROR!!!!!!!!!");
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(mongoSanitize());     // does not let special characters of mongo to be written on search query on google as attackers might steel data not allowed for them to see (mongo injection)

app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    name: "session",
    secret : "thisshouldbeabettersecret!",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        // secure: true,  // doing true will mean that session cookie will work only for secure http or HTTPS. (localhost is not a secure http for production we'll secure this)
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({crossOriginEmbedderPolicy: true}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.activeUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    let statusCode = err.statusCode;
    if (!err.statusCode) statusCode = 500;
    if (!err.message) message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("LIstening on port number 3000");
});