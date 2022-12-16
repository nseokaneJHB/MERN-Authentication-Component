// Express initialization
const express = require("express");
const router = express.Router();

// Controller
const authController = require("../controllers/AuthController")

// middleware
const { verifyToken } = require("../utils/middleware")

// Endpoints
router.post("/sign-up/", authController.signup)
router.post("/sign-in/", authController.signin)
router.post("/sign-out/", verifyToken, authController.signout)
router.post("/password-reset-request/", authController.passwordresetrequest)
router.get("/password-reset-verify/:userId/:token/", authController.passwordresetverifytoken)
router.post("/password-reset/:userId/:token/", authController.passwordreset)

module.exports = router