// Express initialization
const express = require("express");
const app = express();

// Third Party Middleware And Libraries
const jwt = require("jsonwebtoken");

// Imports
const UserModel = require("./UserModel");
const {
	convertToTitleCase,
	responseWithData,
	throwError,
	saveUser,
	hashPassword,
} = require("./Utils");
const {
	getUserById,
	checkNameEmailAndPassword,
	checkPassword,
} = require("./Validation");

// Endpoints
const endPoints = (request, response) => {
	const URLS = {
		"SIGN IN": {
			Endpoint: "/sign/in/",
			Description: "Login on the website",
			Methods: "[POST]",
			Body: "[name, email, password]",
			Response: "{}",
		},
		"SIGN UP": {
			Endpoint: "/sign/up/",
			Description: "Register on the website",
			Methods: "[POST]",
			Body: "[name, email, password]",
			Response: "{}",
		},
		"SIGN OUT": {
			Endpoint: "/sign/out/",
			Description: "Logout from the website",
			Methods: "[POST]",
			Body: "N/A",
			Response: "{}",
		},
		SETTINGS: {
			Endpoint: "/settings/",
			Description: "Read, Update, Deactivate profile",
			Methods: "[GET, PUT]",
			Body: "[name, email, active, password]",
			Response: "{}",
		},
		"PASSWORD CHANGE": {
			Endpoint: "/settings/change-password/",
			Description: "Change password",
			Methods: "[PUT]",
			Body: "[old_password, new_password]",
			Response: "{}",
		},
	};

	response.json(URLS);
};

// Get Profile
const getProfile = async (request, response, next) => {
	const { isAuth, userId } = await request.ACD;
	const user = await getUserById(isAuth, userId, next);
	return responseWithData(response, 201, user);
};

// Sign Up
const signUp = async (request, response, next) => {
	let { name, email, password } = request.body;

	try {
		// Error Handling
		checkNameEmailAndPassword(name, email, password);
		name = convertToTitleCase(name.trim());

		// Hash Password
		const user = new UserModel({
			name,
			email,
			password: hashPassword(password),
		});

		// Write to database
		return await saveUser(response, user);
	} catch (error) {
		let errors = [];

		if (error.errors) errors.push(error.errors);

		if (error.keyValue) {
			const keys = Object.keys(error.keyValue);
			let message;
			if (error.code === 11000) {
				message = `${email} already exists, please login or sign up with a different email`;
			}
			errors.push({ key: keys[0], message: message || error.message });
		}
		next(throwError(errors, 400));
	}
};

// Sign In
const signIn = async (request, response, next) => {
	let { email, password } = request.body;

	try {
		const user = await UserModel.findOne({ email }).exec();
		if (!user)
			throw throwError(
				[{ key: "email", message: "Invalid email or password" }],
				404
			);

		checkPassword(password, user.password);

		// JWT And Session
		const token_secret = process.env.TOKENSECRETKEY || "somesupersecretkey";
		const token = jwt.sign({ userId: user.id }, token_secret, {
			expiresIn: 24 * 60 * 60 * 1000,
		});
		request.session["acu"] = token; // ACU - Authentication Component User

		return response.status(200).json({
			userId: user.id,
			token: token,
			tokenExpiration: 24 * 60 * 60 * 1000,
		});
	} catch (error) {
		next(error);
	}
};

// Sign Out
const signOut = async (request, response, next) => {
	delete request.session["acu"]; // ACU - Authentication Component User
	request.ACD = {
		// ACD - Authentication Component Details
		isAuth: false,
		userId: "",
	};
	return response.status(200).json({
		message: "Sign out successful",
	});
};

// Update Profile
const updateProfile = async (request, response, next) => {
	const { isAuth, userId } = await request.ACD;
	const user = await getUserById(isAuth, userId, next);

	try {
		// Password validation
		const password = request.body.password;
		checkPassword(password, user.password);

		let name = request.body.name || user.name;
		let email = request.body.email || user.email;
		let active = request.body.active || user.active;

		// Error Handling
		name = convertToTitleCase(name.trim());
		checkNameEmailAndPassword(name, email, null);

		user.name = name;
		user.email = email;
		user.active = active;

		if (!user.active) {
			return await signOut(request, response, next);
		}

		// Write to database
		return await saveUser(response, user);
	} catch (error) {
		next(error);
	}
};

// Change password
const changePassword = async (request, response, next) => {
	const { isAuth, userId } = await request.ACD;
	const user = await getUserById(isAuth, userId, next);

	try {
		const { old_password, new_password } = request.body;

		// Password validation and Error Handling
		checkPassword(old_password, user.password);
		checkNameEmailAndPassword(null, null, new_password);

		// Hash Password
		user.password = hashPassword(new_password);

		// Write to database
		return await saveUser(response, user);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	endPoints,
	signUp,
	signIn,
	signOut,
	getProfile,
	updateProfile,
	changePassword,
};
