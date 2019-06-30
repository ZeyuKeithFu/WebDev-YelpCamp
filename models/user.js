const mongoose = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

// Define User schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
  	username: String,
  	password: String
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);