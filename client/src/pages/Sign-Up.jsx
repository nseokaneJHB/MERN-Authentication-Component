import { useState, useContext } from "react";

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

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { SocialsAuthentication } from "../components/Socials-Authentication";
import { PopupMessage } from "../components/PopupMessage";

// API Service
import AuthContext from "../components/Auth-Context";

export const SignUp = () => {
	const contextApi = useContext(AuthContext);

	const [showError, setShowError] = useState(false);
	const [errors, setErrors] = useState([]);

	const [showConfirmNewPasswordError, setShowConfirmNewPasswordError] =
		useState(false);
	const [confirmNewPasswordErrorMessage, setConfirmNewPasswordErrorMessage] =
		useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userCredentials, setUserCredentials] = useState({
		name: "",
		email: "",
		password: "",
		confirm_password: "",
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setShowError(false);
		setErrors([]);
		setShowConfirmNewPasswordError(false);
		setConfirmNewPasswordErrorMessage("");
		setUserCredentials({ ...userCredentials, [name]: value });
	};

	const handleClosePopup = () => {
		setShowError(false);
		setErrors([]);
		setShowSuccess(false);
		setSuccessMessage("");
	};

	const navigate = useNavigate();

	const { mutate: mutateSignUp } = useMutation({
		mutationFn: (data) => contextApi.signUpApiCall(data),
		onSuccess: (response) => {
			setUserCredentials({
				name: "",
				email: "",
				password: "",
				confirm_password: "",
			});
			setShowSuccess(true);
			setSuccessMessage(
				`Thank you for signing up with us ${response.data.name}`
			);
			setTimeout(() => {
				navigate("/sign-in", { replace: true });
			}, 5000);
		},
		onError: (error) => {
			if (error.response.data.errors) {
				setErrors([...error.response.data.errors[0]]);
				setShowError(true);
			}
		},
	});

	const handleSignUp = (event) => {
		event.preventDefault();
		handleClosePopup();
		if (!userCredentials.confirm_password.match(userCredentials.password)) {
			setShowConfirmNewPasswordError(true);
			setConfirmNewPasswordErrorMessage(
				"Confirm password doesn't match your new password"
			);
			return false;
		} else {
			mutateSignUp(userCredentials);
		}
	};

	return (
		<form className="h-full grid grid-cols-1 md:grid-cols-2 md:place-items-center border">
			<div className="w-full p-4 sm:px-6 lg:px-10 xl:w-4/6">
				<h1 className="text-4xl font-bold text-center">Sign Up</h1>
				<PopupMessage
					pType={"success"}
					pShow={showSuccess}
					pClose={() => handleClosePopup(setShowSuccess, setSuccessMessage)}
					pMessage={successMessage}
				/>
				<Input
					iLabel={"Name"}
					iIcon={<UserIcon className={DefaultIconStyles} />}
					iType={"text"}
					iName={"name"}
					iPlaceholder={"Your name..."}
					iValue={userCredentials.name}
					handleOnChange={handleInputChange}
				/>
				{errors && (
					<PopupMessage
						pType={"error"}
						pShow={showError}
						pClose={handleClosePopup}
						pMessage={errors.filter((err) => err.key === "name")[0]?.message}
					/>
				)}
				<Input
					iLabel={"Email Address"}
					iIcon={<AtSymbolIcon className={DefaultIconStyles} />}
					iType={"text"}
					iName={"email"}
					iPlaceholder={"Your email address..."}
					iValue={userCredentials.email}
					handleOnChange={handleInputChange}
				/>
				{errors && (
					<PopupMessage
						pType={"error"}
						pShow={showError}
						pClose={handleClosePopup}
						pMessage={errors.filter((err) => err.key === "email")[0]?.message}
					/>
				)}
				<Input
					iLabel={"Password"}
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"password"}
					iPlaceholder={"Your password..."}
					iValue={userCredentials.password}
					handleOnChange={handleInputChange}
				/>
				{errors && (
					<PopupMessage
						pType={"error"}
						pShow={showError}
						pClose={handleClosePopup}
						pMessage={
							errors.filter((err) => err.key === "password")[0]?.message
						}
						pStyles={"flex justify-end"}
					/>
				)}
				<Input
					iLabel={"Confirm Password"}
					iIcon={<LockOpenIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"confirm_password"}
					iPlaceholder={"Confirm your password..."}
					iValue={userCredentials.confirm_password}
					handleOnChange={handleInputChange}
				/>
				<PopupMessage
					pType={"error"}
					pShow={showConfirmNewPasswordError}
					pClose={() =>
						handleClosePopup(
							setShowConfirmNewPasswordError,
							setConfirmNewPasswordErrorMessage
						)
					}
					pMessage={confirmNewPasswordErrorMessage}
				/>
				<div className="flex justify-between">
					<small className="text-xs font-sans">
						Already have an account?{" "}
						<Link
							className="text-blue-500 hover:text-blue-600 visited:text-blue-400"
							to={"/sign-in"}
						>
							Sign in
						</Link>
					</small>
					<small className="text-xs font-sans">
						Forgot password?{" "}
						<Link
							className="text-blue-500 hover:text-blue-600 visited:text-blue-400"
							to={"/"}
						>
							Reset password
						</Link>
					</small>
				</div>
				<Button
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType={"submit"}
					bLabel={"Sign Up"}
					handleOnClick={handleSignUp}
				/>
				<SocialsAuthentication />
			</div>
			<div className="hidden md:block h-full w-full bg-blue-400 p-4 sm:px-6 lg:px-10"></div>
		</form>
	);
};
