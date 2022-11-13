// Express initialization
const express = require("express");
const app = express();

// Third Party Middleware And Libraries
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Imports
const apiServices = require("./Service");
const { handleError, isAuthenticated } = require("./Middleware");

// Initializations
const PORT = process.env.PORT || 9000;
const db_connection_string = process.env.LOCAL_DB_URL || "";
const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
};
const cookie_secret = process.env.COOKIESECRETKEY || "";

// Middleware
app.use(
	cookieSession({
		name: "acs", // acs - Authentication Component Session
		secret: cookie_secret, // should use as secret environment variable
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
	})
);
app.use(cookieParser());
app.use((request, response, next) => {
	response.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type"
	);
	next();
});
app.use(cors(corsOptions));
app.use(isAuthenticated);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints
app.get("/api/", apiServices.endPoints);
app.post("/api/auth/sign-up/", apiServices.signUp);
app.post("/api/auth/sign-in/", apiServices.signIn);
app.post("/api/auth/sign-out/", apiServices.signOut);
app.get("/api/settings/", apiServices.getProfile);
app.put("/api/settings/", apiServices.updateProfile);
app.put("/api/settings/change-password/", apiServices.changePassword);
app.get("/api/users/", apiServices.getAllUsers);
app.get("/api/users/:userId", apiServices.getOneUser);
app.delete("/api/users/:userId", apiServices.deleteUser);

// Other Middleware
app.use(handleError);

// Connect to mongoDB and Start Server
mongoose
	.connect(db_connection_string)
	.then(() => {
		app.listen(PORT, async () => {
			console.log(`⚡️[server]: Server started at http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		throw err;
	});
