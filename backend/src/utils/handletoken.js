// Third Party Middleware And Libraries
const jwt = require("jsonwebtoken");

// Env
const { TOKEN_SECRET_KEY } = process.env

const generateToken = (user, expiry) => {
	return jwt.sign({ id: user.id }, TOKEN_SECRET_KEY, {
		expiresIn: expiry,
	});
}

const verifyToken = () => {
	
}

module.exports = {
	generateToken,
	verifyToken
}