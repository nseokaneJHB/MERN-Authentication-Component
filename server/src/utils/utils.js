const convertToTitleCase = (str) => {
	return str
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

const successResponse = async (response, code, status, message, data) => {
	return response.status(code).json({ status, message, data })
}

const errorResponse = async (response, code, status, message, errors) => {
	return response.status(code).json({ status, message, errors })
}

const reshapeUserData = async (user) => {
	return {
		id: user._id,
		name: user.name,
		email: user.email,
		active: user.active,
		thumbnail: user.thumbnail.filename,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	}
}

module.exports = {
	convertToTitleCase,
	successResponse,
	errorResponse,
	reshapeUserData,
};
