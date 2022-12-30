import { useState } from "react";

// Third Party
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

// Icons
import { AtSymbolIcon } from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import { passwordResetRequestApiCall } from "../utils/services";

export const PasswordResetRequest = () => {
	const navigate = useNavigate();

  	const [showErrors, setShowErrors] = useState(false);
	const [errors, setErrors] = useState(null);

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [email, setEmail] = useState("");

	const handleInputChange = (event) => {
		setShowErrors(false)
		setShowError(false);
		setEmail(event.target.value);
	};

	// Submit form data api call
	const { status, mutate: mutateSubmitEmail } = useMutation({
		mutationFn: async (data) => await passwordResetRequestApiCall(data),
		onSuccess: async (response) => {
			const { message } = await response;
			setEmail("");
			setShowSuccess(true);
			setSuccessMessage(message);
			setTimeout(() => {
				setShowSuccess(false);
				navigate("/password-reset-confirm/")
			}, 5000);
		},
		onError: async (error) => {
			const { errors, message } = await error.response.data

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

	const handleSubmitEmail = (event) => {
		event.preventDefault();
		mutateSubmitEmail({ email });
	};

	return (
		<form
			className="grid grid-cols-1 place-items-center"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center text-gray-600">
					Password Reset Request
				</h1>
				<p className="my-2 italic text-gray-600 text-center">
					Enter your registered email address and we'll send you a link to reset
					your password.
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
					iDisabled={status === "loading" ? true : false}
					iLabel={"Email Address"}
					iIcon={<AtSymbolIcon className={DefaultIconStyles} />}
					iType={"email"}
					iName={"email"}
					iPlaceholder={"Your email address..."}
					iValue={email}
					handleOnChange={handleInputChange}
				/>
        {errors?.email ? (
          <PopupMessage
            pType={"error"}
            pShow={showErrors}
            pClose={() => handleClosePopup(setShowErrors, setErrors)}
            pMessage={errors?.email}
          />
        ) : (
          <></>
        )}
				<Button
					bDisabled={status === "loading" ? true : false}
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType={"submit"}
					bLabel={"Send Link"}
					handleOnClick={handleSubmitEmail}
				/>
				<Button
					bDisabled={status === "loading" ? true : false}
					bStyles={
						"bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black"
					}
					bType={"button"}
					bLabel={"Cancel"}
					handleOnClick={() => navigate(-1 || "/settings")}
				/>
			</div>
		</form>
	);
};
