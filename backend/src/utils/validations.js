const Joi = require("joi");

const validateName = (name) => {
	const regex = /^[a-zA-Z ]+$/;
	if (name && name.trim() !== "" && name.match(regex)) {
		return true;
	} else {
		return false;
	}
};

const validateEmail = (email) => {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (email && email.trim() !== "" && email.match(regex)) {
		return true;
	} else {
		return false;
	}
};

const validatePassword = (password) => {
	const regex =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/;
	if (password && password.trim() !== "" && password.match(regex)) {
		return true;
	} else {
		return false;
	}
};

const validateNameEmailAndPassword = async (user) => {
	let error = null;

	const nameSchema = Joi.string()
		.trim()
		.min(2)
		.max(255)
		.pattern(/^[a-zA-Z ]+$/)
		.message(`Name should container character only.`)
		.required()
		.label("name")
		.allow(null);
	const emailSchema = Joi.string()
		.trim()
		.email({ minDomainSegments: 2 })
		.min(5)
		.max(500)
		.required()
		.label("email")
		.allow(null);
	const passwordSchema = Joi.string()
		.trim()
		.min(6)
		.max(12)
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/
		)
		.message(
			`Password should be between 6 - 12 character and should include at least:\n- One Lowercase Character\n- One Uppercase Character\n- One Number\n- One Special Character.`
		)
		.required()
		.label("password")
		.allow(null);

	const nameValidate = nameSchema.validate(user.name);
	const emailValidate = emailSchema.validate(user.email);
	const passwordValidate = passwordSchema.validate(user.password);

	if (nameValidate.error) {
		const { message, context } = nameValidate.error.details[0];
		error = {
			...error,
			[context.label]: message,
		};
	}

	if (emailValidate.error) {
		const { message, context } = emailValidate.error.details[0];
		error = {
			...error,
			[context.label]: message,
		};
	}

	if (passwordValidate.error) {
		const { message, context } = passwordValidate.error.details[0];
		error = {
			...error,
			[context.label]: message,
		};
	}

	return error === null ? true : error;
};

const oldPasswordAndNewPassword = async (passwords) => {
	let error = null;

	const passwordSchema = Joi.string()
		.trim()
		.min(6)
		.max(12)
		.required()
		.label("password");

	const oldPasswordValidate = passwordSchema.validate(passwords.current_password);
	const newPasswordValidate = passwordSchema
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,10}$/
		)
		.message(
			`Password should be between 6 - 12 character and should include at least:\n- One Lowercase Character\n- One Uppercase Character\n- One Number\n- One Special Character.`
		)
		.validate(passwords.new_password);

	if (oldPasswordValidate.error) {
		const { message, context } = oldPasswordValidate.error.details[0];
		error = {
			...error,
			[`current_${context.label}`]: message.replace("password", "Current password"),
		};
	}

	if (newPasswordValidate.error) {
		const { message, context } = newPasswordValidate.error.details[0];
		error = {
			...error,
			[`new_${context.label}`]: message.replace("password", "New password"),
		};
	}

	return error === null ? true : error;
};

module.exports = {
	validateName,
	validateEmail,
	validatePassword,
	validateNameEmailAndPassword,
	oldPasswordAndNewPassword,
};
