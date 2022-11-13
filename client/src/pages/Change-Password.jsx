import { useState, useContext } from "react";

// Third Party
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

// Icons
import {
	KeyIcon,
	LockClosedIcon,
	LockOpenIcon,
} from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PopupMessage } from "../components/PopupMessage";

// API Service
import AuthContext from "../components/Auth-Context";

export const ChangePassword = () => {
	const contextApi = useContext(AuthContext);

	const [showPasswordError, setShowPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

	const [showNewPasswordError, setShowNewPasswordError] = useState(false);
	const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");

	const [showConfirmNewPasswordError, setShowConfirmNewPasswordError] =
		useState(false);
	const [confirmNewPasswordErrorMessage, setConfirmNewPasswordErrorMessage] =
		useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userPasswords, setUserPasswords] = useState({
		old_password: "",
		new_password: "",
		confirm_new_password: "",
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setShowPasswordError(false);
		setPasswordErrorMessage("");
		setShowNewPasswordError(false);
		setNewPasswordErrorMessage("");
		setShowConfirmNewPasswordError(false);
		setConfirmNewPasswordErrorMessage("");
		setUserPasswords({ ...userPasswords, [name]: value });
	};

	const handleClosePopup = (error, message) => {
		error(false);
		message("");
	};

	const navigate = useNavigate();

	const { mutate: mutateChangePassword } = useMutation({
		mutationFn: (data) => contextApi.changePasswordApiCall(data),
		onSuccess: (response) => {
			setUserPasswords({
				old_password: "",
				new_password: "",
				confirm_new_password: "",
			});
			setShowSuccess(true);
			setSuccessMessage("Password updated");
			setTimeout(() => {
				navigate("/settings", { replace: true });
			}, 5000);
		},
		onError: (error) => {
			if (error.response.data.errors) {
				const errors = error.response.data.errors;
				setShowNewPasswordError(true);
				setNewPasswordErrorMessage(errors[0].message);
			} else {
				setPasswordErrorMessage(error.response.data.message);
				setShowPasswordError(true);
			}
		},
	});

	const handleChangePassword = (event) => {
		event.preventDefault();
		if (!userPasswords.confirm_new_password.match(userPasswords.new_password)) {
			setShowConfirmNewPasswordError(true);
			setConfirmNewPasswordErrorMessage(
				"Confirm password doesn't match your new password"
			);
			return false;
		} else {
			mutateChangePassword(userPasswords);
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
				<Input
					iLabel={"Old Password"}
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"old_password"}
					iPlaceholder={"Your old password..."}
					iValue={userPasswords.old_password}
					handleOnChange={handleInputChange}
				/>
				<PopupMessage
					pType={"error"}
					pShow={showPasswordError}
					pClose={() =>
						handleClosePopup(setShowPasswordError, setPasswordErrorMessage)
					}
					pMessage={passwordErrorMessage}
				/>
				<Input
					iLabel={"New Password"}
					iIcon={<KeyIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"new_password"}
					iPlaceholder={"Your new password..."}
					iValue={userPasswords.new_password}
					handleOnChange={handleInputChange}
				/>
				<PopupMessage
					pType={"error"}
					pShow={showNewPasswordError}
					pClose={() =>
						handleClosePopup(
							setShowNewPasswordError,
							setNewPasswordErrorMessage
						)
					}
					pMessage={newPasswordErrorMessage}
					pStyles={"flex justify-end"}
				/>
				<Input
					iLabel={"Confirm New Password"}
					iIcon={<LockOpenIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"confirm_new_password"}
					iPlaceholder={"Confirm your new password..."}
					iValue={userPasswords.confirm_new_password}
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
				<Button
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType={"submit"}
					bLabel={"Change password"}
					handleOnClick={handleChangePassword}
				/>
				<Link
					className={
						"block rounded my-3 w-full py-2 border text-center shadow-md hover:shadow-xl bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500"
					}
					to={"/settings"}
				>
					Cancel
				</Link>
			</div>
		</form>
	);
};
