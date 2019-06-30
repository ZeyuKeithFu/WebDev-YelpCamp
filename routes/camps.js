const express 	 = require("express"),
	  Camp 		 = require("../models/camp"),
	  Comment	 = require("../models/comment"),
	  middleware = require("../middleware");
var router = express.Router();

// INDEX Route
router.get("/", function(req, res) {
	Camp.find(function (err, camps) {
  		if (err) return console.error(err);
  		res.render("camps/index", {title: "Camp List", campList: camps});
	});
});

// NEW Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("camps/new", {title: "Create New Camp"});
});

// CREATE Route
router.post("/", middleware.isLoggedIn, function(req, res) {
	var newCamp = req.body.camp;
	newCamp.author = {
		id: req.user._id,
		username: req.user.username
	};
	Camp.create(newCamp, function(err) {
		if(err) {
			console.log("Failed saving new camp!");
		} else {
			console.log("New camp saved!");
		}
	});
	res.redirect("/camps");
});

// SHOW Route
router.get("/:id", function(req, res) {
	Camp.findById(req.params.id).populate("comments").exec(function(err, camp) {
		if(err) return console.error(err);
		res.render("camps/show", {title: "Camp Details", camp: camp});
	});
});

// EDIT Route
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res) {
	Camp.findById(req.params.id, function(err, camp) {
		if(err) {
			res.redirect("/camps");
			return console.error(err);
		}
		res.render("camps/edit", {title: "Edit Camp", camp: camp});
	});
});

// UPDATE Route
router.put("/:id", middleware.checkCampOwnership, function(req, res) {
	Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err) {
		if(err) {
			console.log("Failed updating camp!");
			res.redirect("/camps");
		} else {
			console.log("Camp updated!");
		}
	});
	res.redirect("/camps/" + req.params.id);
});

// DELETE Route
router.delete("/:id", middleware.checkCampOwnership, function(req, res) {
	Camp.findById(req.params.id, function(err, camp) {
		if (err) {
			console.log("Failed removing camp!");
		} else {
			Comment.deleteMany({
				"_id": {
					$in: camp.comments
				}
			}, function(err) {
				if (err) return console.log("Failed removing associate!");
				camp.remove();
				console.log("Camp removed!");
			});
		}
	});
	res.redirect("/camps");
});

module.exports = router;