import { useState } from "react";

// Third Party
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useDispatch } from 'react-redux'

// Icons
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
// import { SocialsAuthentication } from "../components/Socials-Authentication";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import { signInApiCall } from "../utils/services";

// Context
import { authActions } from "../store/authSlice";

export const SignIn = () => {
	const dispatch = useDispatch()

	const navigate = useNavigate();

	const [showErrors, setShowErrors] = useState(false);
	const [errors, setErrors] = useState(null);

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userCredentials, setUserCredentials] = useState({
		email: "",
		password: "",
	});

	// Handle the changing of inputs
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setErrors({ ...errors, [name]: "" });
		setShowError(false);
		setUserCredentials({ ...userCredentials, [name]: value });
	};

	// Submit form data api call
	const { status, mutate: mutateSignIn } = useMutation({
		mutationFn: async (data) => await signInApiCall(data),
		onSuccess: async (response) => {
			const { message, data } = await response
			setUserCredentials({
				email: "",
				password: "",
			});
			setSuccessMessage(message);
			setShowSuccess(true);
			dispatch(authActions.login(data))
			navigate("/settings/");
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
				}, 3000);
			} else {
				setErrorMessage("Oops, something went wrong. Please try again later.");
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
				}, 5000);
			}
		},
	});

	// Handle submitting of data
	const handleSignIn = (event) => {
		// Add loader here...
		event.preventDefault();
		mutateSignIn(userCredentials);
	};

	return (
		<form className="grid grid-cols-1 md:grid-cols-2 place-items-center border" style={{ minHeight: "95%" }}>
			<div className="hidden md:block h-full w-full bg-blue-400 p-4 sm:px-6 lg:px-10"></div>
			<div className="w-full p-4 sm:px-6 lg:px-10 xl:w-4/6">
				<h1 className="text-4xl font-bold text-center text-gray-600">Sign In</h1>
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
						pType={"error"}
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
						pStyles="flex justify-end"
						pType="error"
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.password}
					/>
				) : null}
				<p className="text-xs text-center text-gray-600 mt-3">
					Don't have an account?{" "}
					<Link
						className="text-blue-500 hover:opacity-75"
						to={"/sign-up"}
					>
						Sign up
					</Link>
					{" "}or{" "}
					<Link
						className="text-blue-500 hover:opacity-75"
						to={"/password-reset-request/"}
					>
						Reset password
					</Link>
				</p>
				<Button
					bDisabled={!!(status === "loading")}
					bStyles="bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					bType="submit"
					bLabel="Sign In"
					handleOnClick={handleSignIn}
				/>
				{/* <SocialsAuthentication /> */}
			</div>
		</form>
	);
};
