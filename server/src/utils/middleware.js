// Third Party Middleware And Libraries
const jwt = require("jsonwebtoken");

// Imports
const UserModel = require("../models/UserModel");

// Utils
const { errorResponse } = require("./utils");

const verifyToken = async (request, response, next) => {
	try {
		const headerCookie = request.headers.cookie
		const token = headerCookie.split("=")[1]

		if (!token) {
			return errorResponse(response, 404, "error", "Token not found", null);
		}

		let decode;
		try {
			decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
		} catch (error) {
			return errorResponse(response, 404, "error", "Invalid token, please login again", null);
		}

		if (!decode.id) {
			return errorResponse(response, 401, "error", "Unauthorized access", null);
		}

		try {
			const user = await UserModel.findById(decode.id).exec();
			request.user = {
				userId: user.id,
				role: user.role,
			};

			return next();
		} catch (error) {
			return errorResponse(response, 404, "error", error.message, error);
		}
	} catch (error) {
		return errorResponse(response, 401, "error", "Unauthorized access", null);
	}
};

module.exports = {
	verifyToken,
};
