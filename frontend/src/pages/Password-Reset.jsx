import { useState } from "react";

// Third Party
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

// Icons
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import { verifyTokenApiCall, passwordResetApiCall } from "../utils/services";

export const PasswordReset = () => {
	const navigate = useNavigate();
	const params = useParams()

	const [showErrors, setShowErrors] = useState(false);
	const [errors, setErrors] = useState(null);

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userPasswords, setUserPasswords] = useState({
		password: "",
		confirm_password: "",
	});

	const handleInputChange = (event) => {
    const { name, value } = event.target;
		setShowErrors(false);
    	setErrors({ ...errors, [name]: "" });
		setShowError(false);
		setUserPasswords({ ...userPasswords, [name]: value });
	};

	// Verify Token
	const { status: verifyTokenLoading } = useQuery(
		["verifytoken"],
		async () => await verifyTokenApiCall(params),
		{
			onError: async (error) => {
				const { message } = await error.response.data;
				setErrorMessage(message);
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
					navigate("/sign-in", { replace: true });
				}, 5000);
			},
			refetchOnWindowFocus: false,
		}
	);

	// Submit form data api call
	const { status, mutate: mutateSubmitNewPassword } = useMutation({
		mutationFn: async (data) => await passwordResetApiCall(params, data),
		onSuccess: async (response) => {
			setUserPasswords({
				password: "",
				confirm_password: "",
			});
			const { message } = await response;
			setShowSuccess(true);
			setSuccessMessage(message);
			setTimeout(() => {
				setShowSuccess(false);
				navigate("/sign-in", { replace: true });
			}, 5000);
		},
		onError: async (error) => {
			const { errors, message } = await error.response.data;

			if (errors) {
				setErrors(errors);
				setShowErrors(true);
			} else if (message) {
				setErrorMessage(message);
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
				}, 3000);
			} else {
				console.log(await error.response);
			}
		},
	});

	const handleSubmitNewPassword = async (event) => {
		event.preventDefault();
    if (!userPasswords.confirm_password.match(userPasswords.password)) {
			setErrors({
				...errors,
				confirm_password: "Confirm password doesn't match your password",
			});
			setShowErrors(true);
			return false;
		} else {
		  mutateSubmitNewPassword({ password: userPasswords.password });
		}
	};

	return (
		<form
			className="grid grid-cols-1 place-items-center"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center text-gray-600">
					Reset Your Password
				</h1>
				<p className="my-2 italic text-gray-600 text-center">
					What would you like your new password to be?
				</p>
				<PopupMessage
					pType={"success"}
					pShow={showSuccess}
					pClose={() => handleClosePopup(setShowSuccess, setSuccessMessage)}
					pMessage={successMessage}
				/>
				<PopupMessage
					pType={"error"}
					pShow={showError}
					pClose={() => handleClosePopup(setShowError, setErrorMessage)}
					pMessage={errorMessage}
				/>
				<Input
          			iDisabled={status === "loading" || verifyTokenLoading === "loading" ? true : false}
					iLabel={"Password"}
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"password"}
					iPlaceholder={"Your password..."}
					iValue={userPasswords.password}
					handleOnChange={handleInputChange}
				/>
				{errors?.password ? (
					<PopupMessage
						pType={"error"}
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.password}
					/>
				) : (
					<></>
				)}
				<Input
          			iDisabled={status === "loading" || verifyTokenLoading === "loading" ? true : false}
					iLabel={"Confirm Password"}
					iIcon={<LockOpenIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"confirm_password"}
					iPlaceholder={"Confirm your password..."}
					iValue={userPasswords.confirm_password}
					handleOnChange={handleInputChange}
				/>
				{errors?.confirm_password ? (
					<PopupMessage
						pType={"error"}
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.confirm_password}
					/>
				) : (
					<></>
				)}
				<Button
					bDisabled={status === "loading" || verifyTokenLoading === "loading" ? true : false}
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType={"submit"}
					bLabel={"Confirm New Password"}
					handleOnClick={async (event) =>  await handleSubmitNewPassword(event)}
				/>
				<Button
					bDisabled={status === "loading" || verifyTokenLoading === "loading" ? true : false}
					bStyles={
						"bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black"
					}
					bType={"button"}
					bLabel={"Ignore"}
					handleOnClick={() => navigate("/sign-in")}
				/>
			</div>
		</form>
	);
};
