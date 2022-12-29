// Express initialization
const express = require("express");
const app = express();

// Third Party Middleware And Libraries
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Imports
const authRouter = require("./routes/AuthRouter");
const userRouter = require("./routes/UserRouter");

// Initializations
const { PORT, REMOTE_DB_URL, LOCAL_DB_URL, DOCKER_DB_URL, CLIENT_URL } = process.env;

const corsOptions = {
	origin: CLIENT_URL,
	credentials: true,
};

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/', express.static('uploads'))

// Endpoints
app.get("/api", async (request, response, next) => {
	const URLS = {
		"SIGN IN": {
			Endpoint: "/sign-in/",
			Description: "Login on the website",
			Methods: "[POST]",
			Body: "[name, email, password]",
			Response: "{}",
		},
		"SIGN UP": {
			Endpoint: "/sign-up/",
			Description: "Register on the website",
			Methods: "[POST]",
			Body: "[name, email, password]",
			Response: "{}",
		},
		"SIGN OUT": {
			Endpoint: "/sign-out/",
			Description: "Logout from the website",
			Methods: "[POST]",
			Body: "N/A",
			Response: "{}",
		},
	};

	response.status(200).json(URLS);
});
app.use("/api", authRouter);
app.use("/api", userRouter);

// Other Middleware

// Connect to mongoDB and Start Server
mongoose
	.connect(REMOTE_DB_URL || DOCKER_DB_URL || LOCAL_DB_URL)
	.then(() => {
		app.listen(PORT, async () => {
			console.log(
				`⚡️[server]: Server started at http://localhost:${PORT || 9000}`
			);
		});
	})
	.catch((err) => {
		throw err;
	});
