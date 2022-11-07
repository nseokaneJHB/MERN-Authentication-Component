const validateName = (name) => {
	const regex = /^[a-zA-Z ]+$/
	if (name.match(regex)) {
		return true
	} else {
		return false	
	}
}

const validateEmail = (email) => {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	if (email.match(regex)) {
		return true
	} else {
		return false	
	}
}

const validatePassword = (password) => {
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
	if (password.match(regex)) {
		return true
	} else {
		return false	
	}
}

module.exports = {
	validateName,
	validateEmail,
	validatePassword
}