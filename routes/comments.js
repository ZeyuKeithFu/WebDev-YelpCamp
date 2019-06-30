const express 	 = require("express"),
	  Camp 		 = require("../models/camp"),
	  Comment 	 = require("../models/comment"),
	  middleware = require("../middleware");
var router = express.Router({mergeParams: true});

// NEW Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Camp.findById(req.params.id, function(err, camp) {
		if(err) return console.error(err);
		res.render("comments/new", {title: "New Comment", camp: camp});
	});
});

// CREATE Route
router.post("/", middleware.isLoggedIn, function(req, res) {
	Camp.findById(req.params.id, function(err, camp) {
		if(err) {
			res.redirect("/camps/" + camp._id);
			return console.error(err);
		}
		Comment.create(req.body.comment, function(err, comment) {
			if(err) return console.error(err);
			// Save Comment
			comment.author.id = req.user._id;
			comment.author.username = req.user.username;
			comment.save();
			// Save Camp
			camp.comments.push(comment);
			camp.save();
			req.flash("success", "Your comment has been posted!!!");
			res.redirect("/camps/" + camp._id);
		});
	});
});

// DELETE Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, comment) {
		if (err) return console.log(err);
		comment.remove();
		console.log("Comment deleted!");
		Camp.findById(req.params.id, function(err, camp) {
			if (err) return console.log(err);
			camp.comments.pull(comment._id);
			camp.save();
		});
		req.flash("success", "Your comment has been deleted!!!");
		res.redirect("/camps/" + req.params.id);
	});
});

module.exports = router;