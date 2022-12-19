// Express initialization
const express = require("express");
const router = express.Router();

// Controller
const userController = require("../controllers/UserController")

// middleware
const { verifyToken } = require("../utils/middleware")

// Utils
const { handleImageData } = require("../utils/handleImage")

// Endpoints
router.get("/settings/", verifyToken, userController.getMe)
router.put("/settings/", verifyToken, handleImageData.single("thumbnail"), userController.updateMe)
router.delete("/settings/", verifyToken, userController.deleteMe)
router.put("/change-email/", verifyToken, userController.changeEmail)
router.put("/change-password/", verifyToken, userController.changePassword)

module.exports = router