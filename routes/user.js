const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require('../middleware');
const { RegisterPageShow, RegisterUser, LoginPageShow, LoginUser, Logout } = require('../controllers/users');


router.route('/register')
    .get(catchAsync(RegisterPageShow))
    .post(catchAsync(RegisterUser));

router.route('/login')
    .get(catchAsync(LoginPageShow))
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }) , LoginUser);

router.get('/logout', Logout)

module.exports = router;
