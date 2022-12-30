import { useState } from "react";

// Third Party
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";

// Utils
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import { deleteMeApiCall } from "../utils/services";

// Context
import { authActions } from "../store/authSlice";

export const DeleteAccount = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const { status: deleteMeStatus, mutate: mutateDeleteMe } = useMutation({
		mutationFn: async () => await deleteMeApiCall(),
		onSuccess: async (response) => {
			const { message } = await response;
			setShowSuccess(true);
			setSuccessMessage(message);
			setTimeout(() => {
				setShowSuccess(false);
				dispatch(authActions.logout());
				navigate("/sign-in", { replace: true });
			}, 4000);
		},
		onError: async (error) => {
			const { message } = await error.response.data;
			setErrorMessage(message);
			setShowError(true);
			setTimeout(() => {
				setShowError(false);
				dispatch(authActions.logout());
				navigate("/sign-in", { replace: true });
			}, 4000);
		},
	});

	return (
		<form
			className="grid grid-cols-1 place-items-center"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center text-gray-600">
					Delete Account
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
					Are you sure you want to delete your account?
				</p>
				<div className="flex gap-2">
					<Button
						bDisabled={deleteMeStatus === "loading" ? true : false}
						bStyles={
							"bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black"
						}
						bType={"button"}
						bLabel={"No, go back"}
						handleOnClick={() => navigate(-1)}
					/>
					<Button
						bDisabled={deleteMeStatus === "loading" ? true : false}
						bStyles={
							"bg-rose-400 hover:bg-rose-500 border-rose-500 hover:border-rose-500 text-black"
						}
						bType={"button"}
						bLabel={"Yes"}
						handleOnClick={() => mutateDeleteMe()}
					/>
				</div>
			</div>
		</form>
	);
}
