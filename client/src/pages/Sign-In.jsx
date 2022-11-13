import { useState, useContext } from "react";

// Third Party
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

// Icons
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { SocialsAuthentication } from "../components/Socials-Authentication";
import { PopupMessage } from "../components/PopupMessage";

// API Service
import AuthContext from "../components/Auth-Context";

export const SignIn = () => {
	const contextApi = useContext(AuthContext);

	const [showCredentialsError, setShowCredentialsError] = useState(false);
	const [credentialsErrorMessage, setCredentialsErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userCredentials, setUserCredentials] = useState({
		email: "",
		password: "",
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setShowCredentialsError(false);
		setCredentialsErrorMessage("");
		setUserCredentials({ ...userCredentials, [name]: value });
	};

	const handleClosePopup = () => {
		setShowCredentialsError(false);
		setCredentialsErrorMessage("");
	};

	const navigate = useNavigate();

	const { mutate: mutateSignIn } = useMutation({
		mutationFn: (data) => contextApi.signInApiCall(data),
		onSuccess: (response) => {
			setUserCredentials({
				email: "",
				password: "",
			});
			setShowSuccess(true);
			setSuccessMessage("Sign in successful");
			setTimeout(() => {
				navigate("/settings", { replace: true });
			}, 5000);
		},
		onError: (error) => {
			setCredentialsErrorMessage(error.response.data.message);
			setShowCredentialsError(true);
		},
	});

	const handleSignIn = (event) => {
		event.preventDefault();
		mutateSignIn(userCredentials);
	};

	return (
		<form className="h-full grid grid-cols-1 md:grid-cols-2 md:place-items-center">
			<div className="hidden md:block h-full w-full bg-blue-400 p-4 sm:px-6 lg:px-10"></div>
			<div className="w-full p-4 sm:px-6 lg:px-10 xl:w-4/6">
				<h1 className="text-4xl font-bold text-center">Sign In</h1>
				<PopupMessage
					pType={"success"}
					pShow={showSuccess}
					pClose={() => handleClosePopup(setShowSuccess, setSuccessMessage)}
					pMessage={successMessage}
				/>
				<Input
					iLabel={"Email Address"}
					iIcon={<AtSymbolIcon className={DefaultIconStyles} />}
					iType={"text"}
					iName={"email"}
					iPlaceholder={"Your email address..."}
					iValue={userCredentials.email}
					handleOnChange={handleInputChange}
				/>
				<Input
					iLabel={"Password"}
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"password"}
					iPlaceholder={"Your password..."}
					iValue={userCredentials.password}
					handleOnChange={handleInputChange}
				/>
				<PopupMessage
					pType={"error"}
					pShow={showCredentialsError}
					pClose={handleClosePopup}
					pMessage={credentialsErrorMessage}
				/>
				<div className="flex justify-between">
					<small>
						Don't have an account?{" "}
						<Link
							className="text-blue-500 hover:text-blue-600 visited:text-blue-400"
							to={"/sign-up"}
						>
							Sign up
						</Link>
					</small>
					<small>
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
					bLabel={"Sign In"}
					handleOnClick={handleSignIn}
				/>
				<SocialsAuthentication />
			</div>
		</form>
	);
};
