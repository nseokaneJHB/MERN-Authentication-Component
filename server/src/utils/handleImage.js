// Imports
const fs = require('fs');
const { getUserById } = require("../controllers/UserController")

// Third Party Middleware And Libraries
const multer = require("multer");
const path = require("path")

// Image storage
const storage = multer.diskStorage({
	destination: async (request, file, cb) => {
		cb(null, "uploads/")
	},
	filename: async(request, file, cb, response) => {
		const { userId } = await request.user;
		const user = await getUserById(response, userId);
		// cb(null, `${user.id}.${file.mimetype.split("/")[1]}`)
		cb(null, `${user.id}`)
	}
})

// Image upload
const handleImageData = multer({
	storage: storage,
	limits: { fileSize: 5 * 1000 * 1000 },
	fileFilter: (request, file, cb) => {
		// Allowed ext
		const filetypes = /jpeg|jpg|png|gif|webp/;
		// Check ext
		const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
		// Check mime
		const mimetype = filetypes.test(file.mimetype);

		if(mimetype && extname){
			return cb(null,true);
		} else {
			cb('Error: Please upload a valid image');
		}
	}
});


// Unlink Thumbnail
const unlinkThumbnail = (user) => {
	try {
		fs.unlinkSync(user.thumbnail.path);
		user.thumbnail = null
	} catch (error) {
		console.log(error.message);
		console.log("But that's okay, we gonna continue");
	}
	return
}

module.exports = {
	handleImageData,
	unlinkThumbnail
};