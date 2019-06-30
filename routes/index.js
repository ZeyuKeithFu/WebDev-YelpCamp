const express  = require("express"),
	  passport = require("passport"),
	  User 	   = require("../models/user");
var router = express.Router();

// Homepage
router.get("/", function(req, res) {
	res.render("home");
});

// Register Page
router.get("/register", function(req, res) {
	res.render("register", {title: "Sign Up to Yelp Camp"});
});

// Register Request
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Hello, " + req.user.username);
			res.redirect("/camps");
		});
	});
});

// Login Page
router.get("/login", function(req, res) {
	res.render("login", {title: "Login to Yelp Camp"});
});

// Login Request
router.post('/login', function(req, res, next) {
  	passport.authenticate('local', function(err, user, info) {
    	if (err) { return next(err); }
    	if (!user) { 
			req.flash("error", "Username or password not correct!!!");
			return res.redirect('/login'); 
		}
    	req.logIn(user, function(err) {
      		if (err) return next(err);
      		var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/camps';
      		delete req.session.redirectTo;
			req.flash("success", "Hello, " + req.user.username);
      		res.redirect(redirectTo);
    	});
  	})(req, res, next);
});

// Logout Route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Successfully logout!!!");
	res.redirect("/camps");
});

module.exports = router;