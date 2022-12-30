// Third Party Middleware And Libraries
const bcrypt = require("bcryptjs");

// Imports
const UserModel = require("../models/UserModel");
const {
	successResponse,
	errorResponse,
	convertToTitleCase,
	reshapeUserData,
} = require("../utils/utils");
const { validateNameEmailAndPassword, oldPasswordAndNewPassword } = require("../utils/validations");
const { sendEmail } = require("../utils/handleemail")

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
const getMe = async (request, response, next) => {
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
const updateMe = async (request, response, next) => {
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
const deleteMe = async (request, response, next) => {
	const { userId } = request.user;
	const user = await getUserById(response, userId);
	
	// Send email for verification
	const email_sent = await sendEmail(user, "Email confirmation", "email-confirmation", ``)

	if (email_sent.status === false) {
		return await errorResponse(response, 400, "error", email_sent.message, email_sent);
	}

	try {
		await user.delete();
	} catch (error) {
		return errorResponse(response, 400, "error", error.message, error);
	}

	return await successResponse(
		response,
		200,
		"success",
		"Account deleted. Please come back again.",
		null
	);
};

// Change email address
const changeEmail = async (request, response, next) => {
	return response.status(200).json({
		message: "Changing email address..."
	})
}

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
	getMe,
	updateMe,
	deleteMe,
	changeEmail,
	changePassword,
};
