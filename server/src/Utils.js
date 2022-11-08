// Third Party Middleware And Libraries
const bcrypt = require("bcrypt");

const convertToTitleCase = (str) => {
	return str
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

const responseWithData = (response, status, user) => {
	return response.status(status).json({
		...user._doc,
		password: null,
		role: null,
		createdAt: new Date(user._doc.createdAt).toDateString(),
		updatedAt: new Date(user._doc.updatedAt).toDateString(),
	});
};

const throwError = (errors, code) => {
	return {
		errors: errors,
		statusCode: code,
	};
};

// Hash Password
const hashPassword = (password) => {
	return bcrypt.hashSync(password, 10);
};

// Save User
const saveUser = async (response, user) => {
	const new_user = await user.save();
	return responseWithData(response, 201, new_user);
};

module.exports = {
	convertToTitleCase,
	responseWithData,
	throwError,
	hashPassword,
	saveUser,
};
