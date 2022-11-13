// Third Party Middleware And Libraries
const bcrypt = require("bcrypt");

// Imports
const UserModel = require("./UserModel");
const { throwError } = require("./Utils");

const validateName = (name) => {
	const regex = /^[a-zA-Z ]+$/;
	if (name.match(regex)) {
		return true;
	} else {
		return false;
	}
};

const validateEmail = (email) => {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (email.match(regex)) {
		return true;
	} else {
		return false;
	}
};

const validatePassword = (password) => {
	const regex =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
	if (password.match(regex)) {
		return true;
	} else {
		return false;
	}
};

// Get User Details
const getUserById = async (isAuth, id, next) => {
	try {
		if (!isAuth) throw new Error("Unauthorized Access");
		const user = await UserModel.findById(id).exec();
		if (!user) throw new Error("User not found");
		return user;
	} catch (error) {
		next(error);
	}
};

// Check if Name, Email and Password are valid
const checkNameEmailAndPassword = (name, email, password) => {
	let errors = [];

	if (name === undefined || (name != null && !validateName(name))) {
		errors.push({ key: "name", message: "Please enter a valid name" });
	}

	if (email != null && !validateEmail(email)) {
		errors.push({
			key: "email",
			message: "Please enter a valid email address",
		});
	}

	if (password != null && !validatePassword(password)) {
		errors.push({
			key: "password",
			message:
				"Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, one special character, and be 8 to 15 characters",
		});
	}

	if (errors.length > 0) throw throwError(errors, 400);

	return true;
};

// Check if password is correct
const checkPassword = (password, db_password) => {
	if (!password) throw new Error("Password is required");
	const match = bcrypt.compareSync(password, db_password);
	if (!match) throw new Error("Incorrect password");
	return;
};

module.exports = {
	validateName,
	validateEmail,
	validatePassword,
	getUserById,
	checkNameEmailAndPassword,
	checkPassword,
};
