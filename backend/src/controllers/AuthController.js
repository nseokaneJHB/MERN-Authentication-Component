// Third Party Middleware And Libraries
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Utils
const UserModel = require("../models/UserModel");
const {
	successResponse,
	errorResponse,
	convertToTitleCase,
} = require("../utils/utils");
const { validateNameEmailAndPassword } = require("../utils/validations");
const { generateToken } = require("../utils/handletoken")
const { sendEmail } = require("../utils/handleemail")

// Env
const { TOKEN_SECRET_KEY, TOKEN_SECRET_KEY_EXPIRY, CLIENT_URL } = process.env

// Other controllers
const { getUserById } = require("./UserController")

// Sign Up
const signup = async (request, response, next) => {
	// Validate inputs
	const valid = await validateNameEmailAndPassword(request.body);
	if (valid !== true) {
		return await errorResponse(response, 400, "error", "", valid);
	}

	const { name, email, password } = request.body;

	let userExists = null;
	try {
		userExists = await UserModel.findOne({ email: email }).exec();
	} catch (error) {
		return errorResponse(response, 400, "error", error.message, error);
	}

	if (userExists !== null) {
		return await errorResponse(
			response,
			400,
			"error",
			"User already exists! Please sign in instead.",
			null
		);
	}

	const hashedPassword = bcrypt.hashSync(password, 12);
	const user = new UserModel({
		email: email,
		password: hashedPassword,
		name: convertToTitleCase(name),
	});

	// Generate Token
	token = generateToken(user, "120s")

	if (!user && !token) return await errorResponse(response, 400, "error", "Request failed", null);

	// Send email for verification
	const email_sent = await sendEmail(user, "Email verification", "email-verification", `${CLIENT_URL}/verify-email/${user.id}/${token}/`)

	if (email_sent.status === false) {
		return await errorResponse(response, 400, "error", email_sent.message, email_sent);
	}

	try {
		await user.save();
	} catch (error) {
		return errorResponse(response, 400, "error", error.message, error);
	}

	return await successResponse(
		response,
		201,
		"success",
		email_sent.message,
		null
	);
};

// Sign In
const signin = async (request, response, next) => {
	// Validate inputs
	const valid = await validateNameEmailAndPassword({
		...request.body,
		name: null,
	});
	if (valid !== true) {
		return await errorResponse(response, 400, "error", "", valid);
	}

	const { email, password } = request.body;

	let user = null;
	try {
		user = await UserModel.findOne({ email: email }).exec();
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}

	if (user === null) {
		return await errorResponse(
			response,
			400,
			"error",
			"Invalid credentials.",
			null
		);
	}

	const isPassword = bcrypt.compareSync(password, user.password);
	if (!isPassword) {
		return await errorResponse(
			response,
			400,
			"error",
			"Invalid credentials.",
			null
		);
	}

	if (!user.active) {
		user.active = true;
		try {
			await user.save();
		} catch (error) {
			return errorResponse(response, 400, "error", error.message, error);
		}
	}

	// Generate Token
	token = generateToken(user, TOKEN_SECRET_KEY_EXPIRY)

	if (request.cookies[user.id]) {
		request.cookies[user.id] = ""
	}

	response.user = {
		userId: user.id
	}

	response.cookie("msacToken", token, {
		path: "/",
		maxAge: 30000 * 60,
		httpOnly: true,
		sameSite: "lax",
	});

	return await successResponse(
		response,
		200,
		"success",
		`Hello ${user.name}, we are glad to see you back.`,
		{ email: user.email, thumbnail: user.thumbnail.filename, verified: user.verified }
	);
};

// Sign Out
const signout = async (request, response, next) => {
	const { userId } = request.user;
	const user = await getUserById(response, userId);
	response.clearCookie(String(user.id));
	request.cookies[user.id] = ""
	request.user = {}
	return await successResponse(
		response,
		200,
		"success",
		`Signed out successfully`,
		null
	);
};

// Verify Token
const verifytokenfromemaillink = async (request, response, next) => {
	const { userId, token } = request.params

	const user = await getUserById(response, userId);	

	let decode = null;
	try {
		decode = jwt.verify(token, TOKEN_SECRET_KEY);

		if (!user && !decode) return await errorResponse(response, 400, "error", "Token expired", null);

		return await successResponse(
			response,
			200,
			"success",
			`Token still alive`,
			null
		);
	} catch (error) {
		return await errorResponse(response, 400, "error", "Token expired. Please request again.", error);
	}
}

// Request reset password link
const passwordresetrequest = async (request, response, next) => {
	// Validate inputs
	const valid = await validateNameEmailAndPassword({ ...request.body, name: null, password: null });
	if (valid !== true) {
		return await errorResponse(response, 400, "error", "", valid);
	}

	const { email } = request.body
	let user = null
	let token = null

	try {
		user = await UserModel.findOne({ email }).exec()
		// Generate Token
		token = generateToken(user, "120s")
	} catch (error) {
		return await errorResponse(response, 400, "error", "Sorry that email does not exist", null);
	}

	if (!user && !token) return await errorResponse(response, 400, "error", "Request failed", null);

	// Send Email
	const email_sent = await sendEmail(user, "Password reset", "password-reset", `${CLIENT_URL}/password-reset/${user.id}/${token}/`)

	if (email_sent.status === false) {
		return await errorResponse(response, 400, "error", email_sent.message, email_sent);
	}

	return await successResponse(
		response,
		200,
		"success",
		email_sent.message,
		null
	);
}

const passwordreset = async (request, response, next) => {
	const { userId, token } = request.params

	const user = await getUserById(response, userId);	

	let decode = null;
	try {
		decode = jwt.verify(token, TOKEN_SECRET_KEY);
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}

	if (!user && !decode) return await errorResponse(response, 400, "error", "Token expired, please restart the forgot password process", null);

	const valid = await validateNameEmailAndPassword({
		...request.body,
		name: null,
		email: null
	});
	if (valid !== true) {
		return await errorResponse(response, 400, "error", "", valid);
	}

	const hashedPassword = bcrypt.hashSync(request.body.password, 12);
	user.password = hashedPassword

	try {
		await user.save();
		return await successResponse(
			response,
			200,
			"success",
			`Password successfully reset. You can now login with your new password.`,
			null
		);
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}
}

const veryfyemailrequest = async (request, response, next) => {
	const { userId } = request.user;
	const user = await getUserById(response, userId);
	// Generate Token
	token = generateToken(user, "120s")

	if (!user && !token) return await errorResponse(response, 400, "error", "Request failed", null);

	// Send email for verification
	const email_sent = await sendEmail(user, "Email verification", "email-verification", `${CLIENT_URL}/verify-email/${user.id}/${token}/`)

	if (email_sent.status === false) {
		return await errorResponse(response, 400, "error", email_sent.message, email_sent);
	}

	return await successResponse(
		response,
		201,
		"success",
		email_sent.message,
		null
	);
}

const veryfyemail = async (request, response, next) => {
	const { userId, token } = request.params

	const user = await getUserById(response, userId);	

	let decode = null;
	try {
		decode = jwt.verify(token, TOKEN_SECRET_KEY);
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}

	if (!user && !decode) return await errorResponse(response, 400, "error", "Token expired, please request to verify the email under your profile", null);

	try {
		user.verified = true
		await user.save();
		return await successResponse(
			response,
			200,
			"success",
			`Email successfully verified.`,
			null
		);
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}
}

module.exports = {
	signup,
	signin,
	signout,
	passwordresetrequest,
	verifytokenfromemaillink,
	passwordreset,
	veryfyemailrequest,
	veryfyemail,
};