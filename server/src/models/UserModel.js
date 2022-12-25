const { Schema, model } = require("mongoose");

const EROLES = {
	ADMIN: "A",
	USER: "U",
};

const UserSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Please enter your name."],
		},
		email: {
			type: String,
			trim: true,
			required: [true, "Please enter a valid email address."],
			unique: [
				true,
				"Email already exists! Please sign in or sign up using a different email.",
			],
		},
		password: {
			type: String,
			trim: true,
			required: [
				true,
				"Password require 6 to 12 characters which contain at least one numeric digit, one uppercase and one lowercase letter.",
			],
		},
		verified: {
			type: Boolean,
			default: false,
		},
		active: {
			type: Boolean,
			default: true,
		},
		role: {
			type: String,
			enum: EROLES,
			default: EROLES.USER,
		},
		thumbnail: {
			fieldname: {
				type: String,
			},
			originalname: {
				type: String,
			},
			encoding: {
				type: String,
			},
			mimetype: {
				type: String,
			},
			destination: {
				type: String,
			},
			filename: {
				type: String,
			},
			path: {
				type: String,
			},
			size: {
				type: Number,
			},
		}
	},
	{
		timestamps: true,
	}
);

module.exports = model("User", UserSchema);
