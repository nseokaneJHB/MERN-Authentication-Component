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
router.post("/password-reset/:userId/:token/", authController.passwordreset)
router.post("/verify-email-request/", verifyToken, authController.veryfyemailrequest)
router.post("/verify-email/:userId/:token/", authController.veryfyemail)
router.get("/verify-token/:userId/:token/", authController.verifytokenfromemaillink)

module.exports = router