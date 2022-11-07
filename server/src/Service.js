// Express initialization
const express = require("express");
const app = express();

// Third Party Middleware And Libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Imports
const UserModel = require('./UserModel')
const { convertToTitleCase, responseWithData } = require('./Utils')
const { validateName, validateEmail, validatePassword } = require('./Validation')

// Endpoints
const endPoints = (request, response) => {
	const URLS = {
		"SIGN IN": {
			"Endpoint": "/sign-in/",
			"Description": "Login on the website",
			"Methods": "[POST]",
			"Body": "[name, email, password]",
			"Response": "{}"
		},
		"SIGN UP": {
			"Endpoint": "/sign-up/",
			"Description": "Register on the website",
			"Methods": "[POST]",
			"Body": "[name, email, password]",
			"Response": "{}"
		},
		"SIGN OUT": {
			"Endpoint": "/sign-out/",
			"Description": "Logout from the website",
			"Methods": "[POST]",
			"Body": "N/A",
			"Response": "{}"
		},
		"SETTINGS": {
			"Endpoint": "/settings/",
			"Description": "Read, Update, Deactivate profile",
			"Methods": "[GET, PUT]",
			"Body": "[name, email, active, password]",
			"Response": "{}"
		},
		"PASSWORD CHANGE": {
			"Endpoint": "/password/change/",
			"Description": "Change password",
			"Methods": "[PUT]",
			"Body": "[old_password, new_password]",
			"Response": "{}"
		},
	}
	
	response.json(URLS);
}

// Sign Up
const signUp = async (request, response, next) => {
	let { name, email, password } = request.body
	let errors = []

	name = convertToTitleCase(name.trim())
	
	// Error Handling
	if (!validateName(name)) errors.push({ key: "name", message: "Please enter a valid name" })
	if (!validateEmail(email)) errors.push({ key: "email", message: "Please enter a valid email address" })
	if (!validatePassword(password)) errors.push({
		key: "password",
		message: "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be 8 to 15 characters"
	})

	if (errors.length > 0) throw ({
		errors: errors,
		statusCode: 400,
	})

	// Hash Password
	const hashedPassword = bcrypt.hashSync(password, 10)
	const user = new UserModel({ name, email, password:	hashedPassword })

	try {
		// Write to database
		const new_user = await user.save()
		return responseWithData(response, 201, new_user)
	} catch (error) {
		const keys = Object.keys(error.keyValue)
		let message;
		if (error.code === 11000) {
			message = `${ email } already exists, please login or sign up with a different email`
		}
		errors.push({ key: keys[0], message: message || error.message })
		next({
			errors: errors,
			statusCode: 400,
		})
	}
}

// Sign In
const signIn = async (request, response, next) => {
	let { email, password } = request.body

	try {
		const user = await UserModel.findOne({ email }).exec()
		if (!user) throw {
			errors: [{ key: "email", message: "Invalid email or password" }],
			statusCode: 404
		}
		const match = bcrypt.compareSync(password, user.password)
		if (!match) throw {
			errors: [{ key: "password", message: "Invalid email or password" }],
			statusCode: 404
		}

		// JWT And Session
		const token_secret = process.env.TOKENSECRETKEY || "somesupersecretkey"
		const token = jwt.sign({ userId: user.id }, token_secret, { expiresIn: 24 * 60 * 60 * 1000 });
		request.session["acu"] = token; // ACU - Authentication Component User

		return response.status(200).json({
			userId: user.id,
			token: token,
			tokenExpiration: 24 * 60 * 60 * 1000
		})
	} catch (error) {
		next(error)
	}
}

// Sign Out
const signOut = async (request, response, next) => {
	delete request.session["acu"]; // ACU - Authentication Component User
	request.ACD = { // ACD - Authentication Component Details
		isAuth: false,
        userId: "",
	}
	return response.status(200).json({
		message: "Sign out successful",
	})
}

// Get User Details
const getUserById = async (isAuth, id, next) => {
	try {
		if (!isAuth) throw ({
			errors: [{ key: "authentication", message: "Unauthorized Access" }],
			statusCode: 401
		})
	
		const user = await UserModel.findById(id).exec()
		if (!user) throw {
			errors: [{ key: "user", message: "User not found" }],
			statusCode: 404
		}

		return user
	} catch (error) {
		next(error)
	}
}

// Get Profile
const getProfile = async (request, response, next) => {
	const { isAuth, userId } = await request.ACD
	const user = await getUserById(isAuth, userId, next)
	return responseWithData(response, 201, user)
}

// Update Profile
const updateProfile = async (request, response, next) => {
	const { isAuth, userId } = await request.ACD
	const user = await getUserById(isAuth, userId, next)

	try {
		const password = request.body.password
		if (!password) throw {
			errors: [{ key: "password", message: "Incorrect password" }],
			statusCode: 401
		}
		// Password validation
		const match = bcrypt.compareSync(password, user.password)
		if (!match) throw {
			errors: [{ key: "password", message: "Incorrect password" }],
			statusCode: 401
		}

		let name = request.body.name || user.name
		let email = request.body.email || user.email

		let errors = []

		// Error Handling
		name = convertToTitleCase(name.trim())
		if (!validateName(name)) errors.push({ key: "name", message: "Please enter a valid name" })
		if (!validateEmail(email)) errors.push({ key: "email", message: "Please enter a valid email address" })
			
		if (errors.length > 0) throw ({
			errors: errors,
			statusCode: 400,
		})

		user.name = name
		user.email = email

		// Write to database
		const new_user = await user.save()
		return responseWithData(response, 201, new_user)
	} catch (error) {
		next(error);
	}
}

// Change password
const changePassword = async (request, response, next) => {
	const { isAuth, userId } = await request.ACD
	const user = await getUserById(isAuth, userId, next)

	try {
		const { old_password, new_password } = request.body

		// Password validation
		const match = bcrypt.compareSync(old_password, user.password)
		if (!match) throw {
			errors: [{ key: "password", message: "Incorrect password" }],
			statusCode: 401
		}
		if (!validatePassword(new_password)) throw {
			errors: [{
				key: "password",
				message: "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be 8 to 15 characters"
			}],
			statusCode: 404
		}

		// Hash Password
		const hashedPassword = bcrypt.hashSync(new_password, 10)
		user.password = hashedPassword

		// Write to database
		const new_user = await user.save()
		return responseWithData(response, 201, new_user)
	} catch (error) {
		next(error);
	}
}

module.exports = {
	endPoints,
	signUp,
	signIn,
	signOut,
	getProfile,
	updateProfile,
	changePassword
}