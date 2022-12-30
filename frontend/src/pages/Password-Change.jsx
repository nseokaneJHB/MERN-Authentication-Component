import { useState } from "react";

// Third Party
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

// Icons
import {
	KeyIcon,
	LockClosedIcon,
	LockOpenIcon,
} from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import { passwordChangeApiCall } from "../utils/services";

export const PasswordChange = () => {
	const navigate = useNavigate();

	const [showErrors, setShowErrors] = useState(false);
	const [errors, setErrors] = useState(null);

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userPasswords, setUserPasswords] = useState({
		current_password: "",
		new_password: "",
		confirm_password: "",
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setErrors({ ...errors, [name]: "" });
		setShowError(false);
		setUserPasswords({ ...userPasswords, [name]: value });
	};

	const { mutate: mutatePasswordChange } = useMutation({
		mutationFn: async (data) => await passwordChangeApiCall(data),
		onSuccess: async (response) => {
			setUserPasswords({
				current_password: "",
				new_password: "",
				confirm_password: "",
			});
			setSuccessMessage(await response.message);
			setShowSuccess(true);
			setTimeout(() => {
				setShowSuccess(false);
				navigate("/sign-in");
			}, 3000);
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

	const handlePasswordChange = (event) => {
		event.preventDefault();
		if (!userPasswords.confirm_password.match(userPasswords.new_password)) {
			setErrors({
				...errors,
				confirm_password: "Confirm password doesn't match your password",
			});
			setShowErrors(true);
			return false;
		} else {
			const { new_password, current_password } = userPasswords
			mutatePasswordChange({ current_password, new_password });
		}
	};

	return (
		<form className="h-full grid grid-cols-1 sm:place-items-center">
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center">Change Password</h1>
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
					iLabel={"Current Password"}
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"current_password"}
					iPlaceholder={"Your current password..."}
					iValue={userPasswords.current_password}
					handleOnChange={handleInputChange}
				/>
				{errors?.current_password ? (
					<PopupMessage
						pType={"error"}
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.current_password}
					/>
				) : (
					<></>
				)}
				<Input
					iLabel={"New Password"}
					iIcon={<KeyIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"new_password"}
					iPlaceholder={"Your new password..."}
					iValue={userPasswords.new_password}
					handleOnChange={handleInputChange}
				/>
				{errors?.new_password ? (
					<PopupMessage
						pType={"error"}
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.new_password}
					/>
				) : (
					<></>
				)}
				<Input
					iLabel={"Confirm New Password"}
					iIcon={<LockOpenIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"confirm_password"}
					iPlaceholder={"Confirm your new password..."}
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
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType={"submit"}
					bLabel={"Change password"}
					handleOnClick={handlePasswordChange}
				/>
				<Button
					bStyles={
						"bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black"
					}
					bType={"button"}
					bLabel={"Cancel"}
					handleOnClick={() => navigate(-1 || '/settings')}
				/>
			</div>
		</form>
	);
};
