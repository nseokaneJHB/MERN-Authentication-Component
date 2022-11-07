// Third Party Middleware And Libraries
const jwt = require("jsonwebtoken");

// Imports
const UserModel = require("./UserModel");

const handleError = (error, request, response, next) => {
	const error_status = error.statusCode || 500;
	const error_message = error.message || "";
	const errors = error.errors;
	response.status(error_status).json({
		success: false,
		status: error_status,
		message: error_message,
		errors: errors,
	});
};

const isAuthenticated = async (request, response, next) => {
	const token = request.session["acu"]; // ACU - Authentication Component User

	request.ACD = {
		// ACD - Authentication Component Details // ACD - Authentication Component Details
		isAuth: false,
		userId: "",
	};

	if (!token || token === "") {
		request.ACD.isAuth = false; // ACD - Authentication Component Details
		return next();
	}

	let decodedToken;
	try {
		const token_secret = process.env.TOKENSECRETKEY || "";
		decodedToken = jwt.verify(token, token_secret);
	} catch (err) {
		request.ACD.isAuth = false; // ACD - Authentication Component Details
		return next();
	}

	if (!decodedToken) {
		request.ACD.isAuth = false; // ACD - Authentication Component Details
		return next();
	}

	try {
		const user = await UserModel.findById(decodedToken.userId).exec();
		if (!user) {
			if (!user) {
				request.ACD.isAuth = false; // ACD - Authentication Component Details
				return next();
			}
		}

		request.ACD = {
			// ACD - Authentication Component Details
			isAuth: true,
			userId: decodedToken.userId,
		};

		next();
	} catch (error) {
		request.ACD.isAuth = false; // ACD - Authentication Component Details
		return next();
	}
};

module.exports = {
	handleError,
	isAuthenticated,
};
