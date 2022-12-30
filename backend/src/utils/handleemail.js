const path = require('path')

// Third Party Middleware And Libraries
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')

// Env
const { GMAIL_EMAIL, GMAIL_PASSWORD, CLIENT_URL } = process.env

// Email configuration
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: GMAIL_EMAIL,
		pass: GMAIL_PASSWORD
	}
})

const sendEmail = async (user, subject, template, url) => {
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
		to: user.email,
		subject: `${subject} for the MERN stack Authentication component`,
		template: template,
		context:{
			name: user.name,
			action_url: url,
			website_url: CLIENT_URL,
			auth_component_email: GMAIL_EMAIL
		}
	}

	try {
		await transporter.sendMail(mailOptions);
		return { status: true, message: `${subject} link sent to ${user.email}. Please check on your span folder if you cannot find it` }
	} catch (error) {
		return { status: false, ...error }
	}
}

module.exports = {
	sendEmail,
}