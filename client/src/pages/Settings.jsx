import { useState } from "react";

// Third Party
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import moment from "moment";
import { useDispatch } from "react-redux";

// Icons
import {
	UserIcon,
	AtSymbolIcon,
	LockClosedIcon,
} from "@heroicons/react/24/solid";

// Utils
import { DefaultIconStyles } from "../utils/default-icon-styles";
import { handleClosePopup } from "../utils/functionalities";

// Components
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PopupMessage } from "../components/PopupMessage";

// API Calls
import {
	getMeApiCall,
	updateMeApiCall,
	verifyEmailRequestApiCall,
} from "../utils/services";

// Context
import { authActions } from "../store/authSlice";

export const Settings = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [showErrors, setShowErrors] = useState(false);
	const [errors, setErrors] = useState(null);

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [showSuccess, setShowSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const [userDetails, setUserDetails] = useState({
		name: "",
		email: "",
		verified: false,
		active: false,
		thumbnail: "",
		password: "",
		createdAt: "",
		updatedAt: "",
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setErrors({ ...errors, [name]: "" });
		setShowError(false);
		setUserDetails({ ...userDetails, [name]: value });
	};

	const { status: profileStatus, data: profileData } = useQuery(
		["userProfileData"],
		async () => await getMeApiCall(),
		{
			onSuccess: async (response) => {
				const { data } = await response;
				setUserDetails({ ...userDetails, ...data, password: "" });
				dispatch(authActions.login(data));
			},
			onError: async (error) => {
				const { message } = await error.response.data;
				
				setErrorMessage(message);
				setShowError(true);
				dispatch(authActions.logout());
				navigate("/sign-in", { replace: true });
			},
			refetchOnWindowFocus: false,
		}
	);

	const { status: updateProfileStatus, mutate: mutateUpdateProfile } =
		useMutation({
			mutationFn: async (payload) => await updateMeApiCall(payload),
			onSuccess: async (response) => {
				queryClient.setQueryData(["userProfileData"], (data) => {
					return data.data;
				});
				const { message } = await response;
				setShowSuccess(true);
				setSuccessMessage(message);
				setTimeout(() => {
					setShowSuccess(false);
				}, 2000);
			},
			onError: async (error) => {
				const { errors, message } = await error.response.data;

				if (errors) {
					setErrors(await errors);
					setShowErrors(true);
				} else if (message) {
					setErrorMessage(message);
					if (message === "Unauthorized access") {
						dispatch(authActions.logout());
						navigate("/sign-in", { replace: true });
					}
					setShowError(true);
					setTimeout(() => {
						setShowError(false);
					}, 3000);
				} else {
					console.log(await error.response.data);
				}
			},
		});

	const { status: verifyEmailRequestStatus, mutate: mutateVerifyEmailRequest } = useMutation({
		mutationFn: async () => await verifyEmailRequestApiCall(),
		onSuccess: async (response) => {
			const { message } = await response;
			setShowSuccess(true);
			setSuccessMessage(message);
			setTimeout(() => {
				setShowSuccess(false);
			}, 5000);
		},
		onError: async (error) => {
			const { errors } = await error.response.data;
			if (errors.command === "CONN") {
				setErrorMessage("Could not complete your request, please make sure you are connected to the internet");
				setShowError(true);
				setTimeout(() => {
				setShowError(false);
				}, 5000);
			}
		},
	});

	const handleUpdateProfile = (event) => {
		event.preventDefault();
		mutateUpdateProfile(userDetails);
	};

	const handleSendVerifyEmail = () => {
		mutateVerifyEmailRequest();
	};

	return (
		<form
			className="grid grid-cols-1 place-items-center"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center text-gray-600">
					Update Profile Details
				</h1>
				<div className="my-3">
					{userDetails?.thumbnail ? (
						<picture>
							<img
								className="rounded-full mx-auto h-[6rem] w-[6rem] before:content-none before:rounded-full"
								src={`${process.env.REACT_APP_API_URL}/${userDetails?.thumbnail}`}
								alt={userDetails?.name}
							/>
						</picture>
					) : (
						<UserIcon
							className={`text-blue-500 hover:text-blue-600 mx-auto h-[6rem] w-[6rem] rounded-full border`}
						/>
					)}
					<div className="my-3 flex justify-between">
						<small className="text-gray-500">
							Joined:{" "}
							{moment(new Date()).diff(moment(userDetails.createdAt), "days")}{" "}
							day(s) ago
						</small>
						<small className="text-gray-500">
							Updated:{" "}
							{moment(new Date()).diff(moment(userDetails.updatedAt), "days")}{" "}
							day(s) ago
						</small>
					</div>
				</div>
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
					iDisabled={
						profileStatus === "loading" ||
						updateProfileStatus === "loading" ||
						!userDetails.verified
							? true
							: false
					}
					iLabel={"Name"}
					iIcon={<UserIcon className={DefaultIconStyles} />}
					iType={"text"}
					iName={"name"}
					iPlaceholder={"Your name..."}
					iValue={userDetails.name}
					handleOnChange={handleInputChange}
				/>
				{errors?.name ? (
					<PopupMessage
						pType={"error"}
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.name}
					/>
				) : (
					<></>
				)}
				<Input
					iDisabled={
						profileStatus === "loading" ||
						updateProfileStatus === "loading" ||
						!userDetails.verified
							? true
							: false
					}
					iLabel={"Email Address"}
					iIcon={<AtSymbolIcon className={DefaultIconStyles} />}
					iType={"text"}
					iName={"email"}
					iPlaceholder={"Your email address..."}
					iValue={userDetails.email}
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
				<Input
					iDisabled={
						profileStatus === "loading" ||
						updateProfileStatus === "loading" ||
						!userDetails.verified
							? true
							: false
					}
					iLabel={"Profile Image"}
					iType={"file"}
					iName={"thumbnail"}
					iPlaceholder={"Your email address..."}
					handleOnChange={(event) =>
						setUserDetails({ ...userDetails, thumbnail: event.target.files[0] })
					}
				/>
				<div className="flex justify-center gap-3 hover:cursor-pointer">
					<input
						className="hover:cursor-pointer"
						disabled={
							profileStatus === "loading" ||
							updateProfileStatus === "loading" ||
							!userDetails.verified
								? true
								: false
						}
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
					<label
						htmlFor="active"
						className="text-gray-600 hover:cursor-pointer"
					>
						Your account will be {userDetails.active ? "active" : "inactive"}.
						Do you want to {userDetails.active ? "deactivate" : "activate"}?
					</label>
				</div>
				{!userDetails.active ? (
					<p className="mt-2 italic text-rose-400">
						<strong>NB:</strong> By leaving the checkbox unchecking you are
						deactivating your account and you will be kicked out of the system.
						<br />
						<br />
						You'll have to sign in again to re-activate your account.
					</p>
				) : (
					<></>
				)}
				<Input
					iDisabled={
						profileStatus === "loading" ||
						updateProfileStatus === "loading" ||
						!userDetails.verified
							? true
							: false
					}
					iLabel={"Password"}
					iIcon={<LockClosedIcon className={DefaultIconStyles} />}
					iType={"password"}
					iName={"password"}
					iPlaceholder={"Enter password to update your profile..."}
					iValue={userDetails.password}
					handleOnChange={handleInputChange}
				/>
				{errors?.password ? (
					<PopupMessage
						pStyles={"flex justify-end"}
						pType={"error"}
						pShow={showErrors}
						pClose={() => handleClosePopup(setShowErrors, setErrors)}
						pMessage={errors?.password}
					/>
				) : (
					<></>
				)}
				<p className="mt-2 italic text-gray-600">
					<strong>NB:</strong> Password is required to update your profile.
				</p>
				{profileData && !userDetails.verified ? (
					<>
            <Button
              bDisabled={
                profileStatus === "loading" || updateProfileStatus === "loading" || verifyEmailRequestStatus === "loading"
                  ? true
                  : false
              }
              bStyles={
                "bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black mb-0"
              }
              bType={"button"}
              bLabel={"Verify Email"}
              handleOnClick={handleSendVerifyEmail}
            />
            <p className="mt-2 italic text-rose-400">
              <strong>NB:</strong> You can't update your information this time because your email is not verified, please click the "Verify Email" button to send an email verification link.
            </p>
          </>
				) : (
					<></>
				)}
				<Button
					bDisabled={
						profileStatus === "loading" ||
						updateProfileStatus === "loading" ||
						!userDetails.verified
							? true
							: false
					}
					bStyles={
						"bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-500"
					}
					bType={"submit"}
					bLabel={"Update Profile"}
					handleOnClick={handleUpdateProfile}
				/>
				<p className="text-center text-gray-600">
					Change{" "}
					<Link
						className="text-blue-500 hover:text-blue-600 visited:text-blue-400"
						to={"/password-change"}
					>
						password
					</Link>
					,{" "}
					<Link
						className="text-blue-500 hover:text-blue-600 visited:text-blue-400"
						to={"/password-change"}
					>
						email
					</Link>{" "}
					Or{" "}
					<Link
						className="text-blue-500 hover:text-blue-600 visited:text-blue-400"
						to={"/delete-account"}
					>
						delete account.
					</Link>
				</p>
			</div>
		</form>
	);
};
