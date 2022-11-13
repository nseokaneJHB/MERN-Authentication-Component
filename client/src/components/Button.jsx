export const Button = ({ bStyles, bType, bLabel, handleOnClick }) => {
	return (
		<button
			className={`rounded my-3 w-full py-2 border shadow-md hover:shadow-xl ${bStyles ? bStyles : ""}`}
			type={bType}
			onClick={handleOnClick}
		>
			{bLabel}
		</button>
	);
};
