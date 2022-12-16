// Third Party Middleware And Libraries
const bcrypt = require("bcrypt");

// Imports
const UserModel = require("../models/UserModel");
const {
	successResponse,
	errorResponse,
	convertToTitleCase,
	reshapeUserData,
} = require("../utils/utils");
const { validateNameEmailAndPassword, oldPasswordAndNewPassword } = require("../utils/validations");

// Get UserById
const getUserById = async (response, userId) => {
	try {
		const user = await UserModel.findById(userId).exec();
		return user;
	} catch (error) {
		return await errorResponse(
			response,
			400,
			"error",
			"User details not found.",
			null
		);
	}
};

// Get Profile
const getme = async (request, response, next) => {
	const { userId } = request.user;
	const user = await getUserById(response, userId);
	return await successResponse(
		response,
		200,
		"success",
		"",
		await reshapeUserData(user)
	);
};

// Update Profile
const updateme = async (request, response, next) => {
	const { userId } = request.user;
	const user = await getUserById(response, userId);

	// Validate inputs
	const valid = await validateNameEmailAndPassword(request.body);
	if (valid !== true) {
		return await errorResponse(response, 400, "error", "", valid);
	}

	const { name, password, active } = request.body;

	// Check if password is valid
	const isPassword = bcrypt.compareSync(password, user.password);
	if (!isPassword) {
		return await errorResponse(
			response,
			400,
			"error",
			"Incorrect password.",
			null
		);
	}

	user.name = convertToTitleCase(name) || user.name;
	user.active = active || user.active;
	user.thumbnail = request.file || user.thumbnail;

	try {
		await user.save();
		if (user.active === false) {
			response.clearCookie(String(user.id));
			return await successResponse(
				response,
				200,
				"success",
				"Profile deactivated. Please sign in to activate.",
				null
			);
		}
		return await successResponse(
			response,
			200,
			"success",
			"Updated successfully.",
			await reshapeUserData(user)
		);
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}
};

// Delete Profile
const deleteme = async (request, response, next) => {};

// Change password
const changePassword = async (request, response, next) => {
	const { userId } = request.user;
	const user = await getUserById(response, userId);

	// Validate inputs
	const valid = await oldPasswordAndNewPassword(request.body);
	if (valid !== true) {
		return await errorResponse(response, 400, "error", "", valid);
	}

	const { current_password, new_password } = request.body;
	
	// Check if password is valid
	const isPassword = bcrypt.compareSync(current_password, user.password);
	if (!isPassword) {
		return await errorResponse(
			response,
			400,
			"error",
			"Incorrect password.",
			null
		);
	}

	if (new_password === current_password) {
		return await errorResponse(
			response,
			400,
			"error",
			"Password in use, please use a different password.",
			null
		);
	}

	const hashedPassword = bcrypt.hashSync(new_password, 12);
	user.password = hashedPassword

	try {
		await user.save();
		response.clearCookie(String(user.id));
		return await successResponse(
			response,
			200,
			"success",
			"Password updated. Please sign in again.",
			null
		);
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}
};

module.exports = {
	getUserById,
	getme,
	updateme,
	deleteme,
	changePassword,
};
