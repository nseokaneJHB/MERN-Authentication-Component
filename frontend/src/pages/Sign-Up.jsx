import { useState } from "react";

// Third Party
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

// Icons
import {
	UserIcon,
	AtSymbolIcon,
	LockClosedIcon,
	LockOpenIcon,
} from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
// import { SocialsAuthentication } from "../components/Socials-Authentication";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import { signUpApiCall } from "../utils/services";

export const SignUp = () => {
	const navigate = useNavigate();

	const [showErrors, setShowErrors] = useState(false);
	const [errors, setErrors] = useState(null);

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userCredentials, setUserCredentials] = useState({
		name: "",
		email: "",
		password: "",
		confirm_password: "",
	});

	// Handle the changing of inputs
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setErrors({ ...errors, [name]: "" });
		setShowError(false);
		setUserCredentials({ ...userCredentials, [name]: value });
	};

	// Submit form data api call
	const { status, mutate: mutateSignUp } = useMutation({
		mutationFn: async (data) => await signUpApiCall(data),
		onSuccess: async (data) => {
			if (data.status === "success") {
				setUserCredentials({
					name: "",
					email: "",
					password: "",
					confirm_password: "",
				});
				setSuccessMessage(await data.message);
				setShowSuccess(true);
				setTimeout(() => {
					setShowSuccess(false);
					navigate("/sign-in");
				}, 3000);
			}
		},
		onError: async (error) => {
			const { errors, message } = await error.response.data;
			if (errors) {
				setErrors(await error.response.data.errors);
				setShowErrors(true);
			} else if (message) {
				setErrorMessage(message);
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
				}, 5000);
			} else {
				console.log(error);
				setErrorMessage(error.message);
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
				}, 5000);
			}
		},
	});

	// Handle submitting of data
	const handleSignUp = (event) => {
		// Add loader here...
		event.preventDefault();
		if (!userCredentials.confirm_password.match(userCredentials.password)) {
			setErrors({
				...errors,
				confirm_password: "Confirm password doesn't match your password",
			});
			setShowErrors(true);
			return false;
		} else {
			mutateSignUp(userCredentials);
		}
	};

	return (
		<form
			className="grid grid-cols-1 md:grid-cols-2 place-items-center border"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4 sm:px-6 lg:px-10 xl:w-4/6">
				<h1 className="text-4xl font-bold text-center text-gray-600">
					Sign Up
				</h1>
				<PopupMessage
					pType="success"
					pShow={showSuccess}
					pClose={() => handleClosePopup(setShowSuccess, setSuccessMessage)}
					pMessage={successMessage}
				/>
				<PopupMessage
					pType="error"
					pShow={showError}
					pClose={() => handleClosePopup(setShowError, setErrorMessage)}
					pMessage={errorMessage}
				/>
				<Input
					iDisabled={!!(status === "loading")}
					iLabel="Name"
					iIcon={<UserIcon className={DefaultIconStyles} />}
					iType="text"
					iName="name"
					iPlaceholder="Your name..."
					iValue={userCredentials.name}
					handleOnChange={handleInputChange}
				/>
				{errors?.name ? (
					<PopupMessage
						pType="error"
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.name}
					/>
				) : null}
				<Input
					iDisabled={!!(status === "loading")}
					iLabel="Email Address"
					iIcon={<AtSymbolIcon className={DefaultIconStyles} />}
					iType="text"
					iName="email"
					iPlaceholder="Your email address..."
					iValue={userCredentials.email}
					handleOnChange={handleInputChange}
				/>
				{errors?.email ? (
					<PopupMessage
						pType="error"
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.email}
					/>
				) : null}
				<Input
					iDisabled={!!(status === "loading")}
					iLabel="Password"
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType="password"
					iName="password"
					iPlaceholder="Your password..."
					iValue={userCredentials.password}
					handleOnChange={handleInputChange}
				/>
				{errors?.password ? (
					<PopupMessage
						pType="error"
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.password}
					/>
				) : null}
				<Input
					iDisabled={!!(status === "loading")}
					iLabel="Confirm Password"
					iIcon={<LockOpenIcon className={DefaultIconStyles} />}
					iType="password"
					iName="confirm_password"
					iPlaceholder="Confirm your password..."
					iValue={userCredentials.confirm_password}
					handleOnChange={handleInputChange}
				/>
				{errors?.confirm_password ? (
					<PopupMessage
						pType="error"
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.confirm_password}
					/>
				) : null}
				<p className="text-xs text-center text-gray-600 mt-3">
					Already have an account?{" "}
					<Link className="text-blue-500 hover:opacity-75" to="/sign-in" >
						Sign in
					</Link>
				</p>
				<Button
					bDisabled={!!(status === "loading")}
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType="submit"
					bLabel="Sign Up"
					handleOnClick={handleSignUp}
				/>
				{/* <SocialsAuthentication /> */}
			</div>
			<div className="hidden md:block h-full w-full bg-blue-400 p-4 sm:px-6 lg:px-10"></div>
		</form >
	);
};
