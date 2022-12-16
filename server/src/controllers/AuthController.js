const path = require('path')

// Third Party Middleware And Libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')

// Utils
const UserModel = require("../models/UserModel");
const {
	successResponse,
	errorResponse,
	convertToTitleCase,
} = require("../utils/utils");
const { validateNameEmailAndPassword } = require("../utils/validations");

// Env
const { TOKEN_SECRET_KEY, TOKEN_SECRET_KEY_EXPIRY, GMAIL_EMAIL, GMAIL_PASSWORD, CLIENT_URL } = process.env

// Email configuration
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: GMAIL_EMAIL,
		pass: GMAIL_PASSWORD
	}
})

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

	try {
		await user.save();
	} catch (error) {
		return errorResponse(response, 400, "error", error.message, error);
	}

	return await successResponse(
		response,
		201,
		"success",
		`Thank you for joining us ${user.name}.`,
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
	const token = jwt.sign({ id: user.id }, TOKEN_SECRET_KEY, {
		expiresIn: TOKEN_SECRET_KEY_EXPIRY,
	});

	if (request.cookies[user.id]) {
		request.cookies[user.id] = ""
	}

	response.cookie(String(user.id), token, {
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
		{ email: user.email, thumbnail: user.thumbnail.filename }
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
const passwordresetverifytoken = async (request, response, next) => {
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
		return await errorResponse(response, 400, "error", "Token expired. Please restart the reset password process or sign in.", error);
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
		token = jwt.sign({ id: user.id }, TOKEN_SECRET_KEY, {
			expiresIn: "120s",
		});
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}

	if (!user && !token) return await errorResponse(response, 400, "error", "Request failed", null);

	// point to the template folder
	const handlebarOptions = {
		viewEngine: {
			partialsDir: path.resolve('./views/'),
			defaultLayout: false,
		},
		viewPath: path.resolve('./views/'),
	};

	// use a template file with nodemailer
	transporter.use('compile', hbs(handlebarOptions))

	const mailOptions = {
		from: `MERN Stack Authentication Component<${GMAIL_EMAIL}>`,
		to: email,
		subject: "Password reset link for the MERN stack Authentication component",
		template: 'email',
		context:{
			name: user.name,
			reset_password_url: `${CLIENT_URL}/password-reset/${user.id}/${token}/`,
			website_url: CLIENT_URL,
			auth_component_email: GMAIL_EMAIL
		}
	}

	try {
		await transporter.sendMail(mailOptions);
		return await successResponse(
			response,
			200,
			"success",
			`Password reset link sent`,
			null
		);
	} catch (error) {
		return await errorResponse(response, 400, "error", error.message, error);
	}
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

	if (!user && !decode) return await errorResponse(response, 400, "error", "Request failed", null);

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

module.exports = {
	signup,
	signin,
	signout,
	passwordresetrequest,
	passwordresetverifytoken,
	passwordreset,
};