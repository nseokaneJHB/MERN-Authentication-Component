import { useState, useContext } from "react";

// Third Party
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Icons
import {
	UserIcon,
	AtSymbolIcon,
	LockClosedIcon,
} from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PopupMessage } from "../components/PopupMessage";

// API Service
import AuthContext from "../components/Auth-Context";

export const Settings = () => {
	const contextApi = useContext(AuthContext);

	const [showAuthError, setShowAuthError] = useState(false);
	const [authErrorMessage, setAuthErrorMessage] = useState("");

	const [showPasswordError, setShowPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userDetails, setUserDetails] = useState({
		name: "",
		email: "",
		active: false,
		password: "",
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setShowPasswordError(false);
		setPasswordErrorMessage("");
		setShowSuccess(false)
		setSuccessMessage("")
		setUserDetails({ ...userDetails, [name]: value });
	};

	const handleClosePopup = () => {
		setShowPasswordError(false);
		setPasswordErrorMessage("");
		setShowSuccess(false)
		setSuccessMessage("")
	};

	const navigate = useNavigate();

	const { isLoading } = useQuery(
		["userProfileData"],
		() => contextApi.getProfileApiCall(),
		{
			onSuccess: (response) => {
				setUserDetails({ ...userDetails, ...response, password: "" });
			},
			onError: (error) => {
				setAuthErrorMessage(error.response.data.message);
				setShowAuthError(true);
				setTimeout(() => {
					setShowAuthError(false);
					setAuthErrorMessage("");
					navigate("/sign-in", { replace: true });
				}, 2000);
			},
			refetchOnWindowFocus: false,
		}
	);

	const queryClient = useQueryClient();

	const { mutate: mutateUpdateProfile } = useMutation({
		mutationFn: (data) => contextApi.updatedProfileApiCall(data),
		onSuccess: (response) => {
			queryClient.setQueryData(["userProfileData"], (data) => {
				return data.data;
			});
			setShowSuccess(true);
			setSuccessMessage("Profile update successful");
			setTimeout(() => {
				setShowSuccess(false);
				setSuccessMessage("");
			}, 5000);
		},
		onError: (error) => {
			setPasswordErrorMessage(error.response.data.message);
			setShowPasswordError(true);
		},
	});

	const handleUpdatedProfile = (event) => {
		event.preventDefault();
		handleClosePopup();
		mutateUpdateProfile(userDetails);
	};

	return (
		<form className="h-full grid grid-cols-1 sm:place-items-center">
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center">
					Update Profile Details
				</h1>
				<PopupMessage
					pType={"success"}
					pShow={showSuccess}
					pClose={() => handleClosePopup(setShowSuccess, setSuccessMessage)}
					pMessage={successMessage}
				/>
				<PopupMessage
					pType={"error"}
					pShow={showAuthError}
					pClose={() => handleClosePopup(setShowAuthError, setAuthErrorMessage)}
					pMessage={authErrorMessage}
				/>
				<Input
					iLabel={"Name"}
					iIcon={<UserIcon className={DefaultIconStyles} />}
					iType={"text"}
					iName={"name"}
					iPlaceholder={"Your name..."}
					iValue={userDetails.name}
					handleOnChange={handleInputChange}
				/>
				<Input
					iLabel={"Email Address"}
					iIcon={<AtSymbolIcon className={DefaultIconStyles} />}
					iType={"text"}
					iName={"email"}
					iPlaceholder={"Your email address..."}
					iValue={userDetails.email}
					handleOnChange={handleInputChange}
				/>
				<div className="flex justify-center gap-3">
					<input
						type="checkbox"
						checked={userDetails.active}
						id="active"
						name="active"
						onChange={() =>
							setUserDetails({
								...userDetails,
								active: !userDetails.active,
							})
						}
						value={userDetails.active}
					/>
					<label htmlFor="active">
						Your account is currently{" "}
						{userDetails.active ? "active" : "inactive"}. Do you want to{" "}
						{userDetails.active ? "deactivate" : "activate"}?
					</label>
				</div>
				{!userDetails.active ? (
					<p className="mt-2 italic">
						<strong>NB:</strong> By unchecking the checkbox you are deactivating
						your account you will be kicked out of the system.
						<br />
						<br />
						You'll have to sign in again to re-activate your account.
					</p>
				) : (
					<></>
				)}
				<Input
					iLabel={"Password"}
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"password"}
					iPlaceholder={"Enter password to update your profile..."}
					iValue={userDetails.password}
					handleOnChange={handleInputChange}
				/>
				<PopupMessage
					pType={"error"}
					pShow={showPasswordError}
					pClose={handleClosePopup}
					pMessage={passwordErrorMessage}
				/>
				<p className="mt-2 italic">
					<strong>NB:</strong> Password is required to update your information.
				</p>
				<Button
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType={"submit"}
					bLabel={"Update Profile"}
					handleOnClick={handleUpdatedProfile}
				/>
				<div className="flex justify-center mt-3">
					<p>
						Do you want to{" "}
						<Link
							className="text-blue-500 hover:text-blue-600 visited:text-blue-400"
							to={"/password-change"}
						>
							change
						</Link>{" "}
						your password?
					</p>
				</div>
			</div>
		</form>
	);
};
