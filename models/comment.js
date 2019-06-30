const mongoose = require("mongoose");

// Define comment schema
const Schema = mongoose.Schema;
const commentSchema = new Schema({
	content: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Comment", commentSchema);