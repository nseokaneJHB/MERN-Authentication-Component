import { useState } from "react";

// Third Party
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

// Utils
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import { verifyTokenApiCall, verifyEmailApiCall } from "../utils/services";

export const VerifyEmail = () => {
	const navigate = useNavigate();
	const params = useParams();

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const { status: verifyEmailStatus, isError: verifyEmailError, mutate: mutateVerifyEmail } = useMutation({
		mutationFn: async () => await verifyEmailApiCall({}, params),
		onSuccess: async (response) => {
			const { message } = await response;
			setShowSuccess(true);
			setSuccessMessage(message);
			setTimeout(() => {
				setShowSuccess(false);
			}, 5000);
		},
		onError: async (error) => {
			const { message } = await error.response.data;
			setErrorMessage(message);
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
			}, 5000);
		},
	});

	// Verify Token
	const { status: verifyTokenStatus, isError: verifyTokenError } = useQuery(
		["verifytoken"],
		async () => await verifyTokenApiCall(params),
		{
			onSuccess: async (response) => {
				mutateVerifyEmail();
			},
			onError: async (error) => {
				const { message } = await error.response.data;
				setErrorMessage(message);
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
				}, 5000);
			},
		}
	);

	return (
		<div
			className="grid grid-cols-1 place-items-center"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center text-gray-600">
					Email Verification
				</h1>
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
				<p className="my-2 italic text-gray-600 text-center">
					{verifyTokenStatus === "loading" || verifyEmailStatus === "loading"
						? "Verifying your email."
						: verifyTokenError === true || verifyEmailError === true
						? "Could not verify your email. Please try again."
						: "Thank you for verifying your email."}
				</p>
				<Button
					bDisabled={
						verifyTokenStatus === "loading" || verifyEmailStatus === "loading"
							? true
							: false
					}
					bStyles={
						"bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black"
					}
					bType={"button"}
					bLabel={"Go Home"}
					handleOnClick={() => navigate("/")}
				/>
			</div>
		</div>
	);
};
