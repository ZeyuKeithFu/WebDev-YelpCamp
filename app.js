// Vars Setup
const express		 = require("express"),
	  request    	 = require("request"),
	  bodyParser  	 = require("body-parser"),
	  mongoose    	 = require("mongoose"),
	  passport		 = require("passport"),
	  localStrategy  = require("passport-local"),
	  methodOverride = require("method-override"),
	  User 			 = require("./models/user"),
	  Camp       	 = require("./models/camp"),
	  flash			 = require("connect-flash"),
	  Comments		 = require("./models/comment"),
	  app       	 = express();

// Routes Setup
const campRoutes 	 = require("./routes/camps"),
	  commentRoutes  = require("./routes/comments"),
	  indexRoutes 	 = require("./routes/index");

// APP Config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify', false);

// PASSPORT Config
app.use(require("express-session")({
	secret: "12 car garage",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// User Config
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes Config
app.use(indexRoutes);
app.use("/camps", campRoutes);
app.use("/camps/:id/comments", commentRoutes);

// Connect to mongoDB
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to MongoDB...");
}).catch(err => {
	console.log("ERROR:", err.message);
});

// Start server
app.listen(process.env.PORT, process.env.IP, function() {
	console.log("Server started...");
});