const User = require("../models/user");

module.exports.RegisterPageShow = async (req, res) => {
    res.render("users/register");
}

module.exports.RegisterUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash("success", "Welcome to Yelp Camp");
            res.redirect("/campgrounds");
        })
    } catch (e) {
        req.flash("error", "A user with the given username is already registered");
        res.redirect("/register");
    }
}

module.exports.LoginPageShow = async (req, res) => {
    res.render("users/login");
}

module.exports.LoginUser = (req, res) => { 
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', `Welcome ${req.body.username}`);
    res.redirect(redirectUrl);
}

module.exports.Logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}