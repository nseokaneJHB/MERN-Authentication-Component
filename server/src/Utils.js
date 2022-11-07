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

module.exports = {
	convertToTitleCase,
	responseWithData,
};
