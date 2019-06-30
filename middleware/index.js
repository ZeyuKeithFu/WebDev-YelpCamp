const Camp = require("../models/camp"),
	  Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.session.redirectTo = req.originalUrl;
	req.flash("error", "Please login first!!!");
	res.redirect("/login");
};

middlewareObj.checkCampOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Camp.findById(req.params.id, function(err, camp) {
			if (err) {
				console.log(err);
				req.session.redirectTo = req.originalUrl;
				req.flash("error", "Camp not found!");
				res.redirect("/camps/" + req.params.id);
			} else {
				if (camp.author.id.equals(req.user._id)) {
					next();
				} else {
					req.session.redirectTo = req.originalUrl;
					req.flash("error", "Permission denied!!!");
					res.redirect("/camps/" + req.params.id);
				}
			}
		});
	} else {
		req.flash("error", "Please login first!!!");
		res.redirect("/login");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, comment) {
			if (err) {
				console.log(err);
				req.flash("error", "Comment not found!");
				res.redirect("/camps/" + req.params.id);
			} else {
				if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Permission denied!!!");
					res.redirect("/camps/" + req.params.id);
				}
			}
		});
	} else {
		req.flash("error", "Please login first!!!");
		res.redirect("/login");
	}
};

module.exports = middlewareObj;