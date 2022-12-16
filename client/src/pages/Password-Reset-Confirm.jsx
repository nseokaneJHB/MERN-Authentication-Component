// Third Party
import { useNavigate } from "react-router-dom";

// Components
import { Button } from "../components/Button";

export const PasswordResetConfirm = () => {
	const navigate = useNavigate();

	return (
		<form
			className="grid grid-cols-1 place-items-center"
			style={{ minHeight: "95%" }}
		>
			<div className="w-full p-4 sm:px-6 lg:px-10 max-w-xl">
				<h1 className="text-4xl font-bold text-center text-gray-600">
					Check Your Email
				</h1>
				<p className="my-2 italic text-gray-600 text-center">
					We just emailed you instructions to reset your password.
				</p>
				<br />
				<p className="my-2 italic text-gray-600 text-center">
					Check your spam mailbox if you do not find it.
				</p>
				<Button
					bStyles={
						"bg-yellow-400 hover:bg-yellow-500 border-yellow-500 hover:border-yellow-500 text-black"
					}
					bType={"button"}
					bLabel={"Home"}
					handleOnClick={() => navigate("/")}
				/>
			</div>
		</form>
	);
};
