export const Button = ({ bStyles, bType, bLabel, handleOnClick, bDisabled }) => {
	return (
		<button
			className={`rounded my-3 w-full py-2 border shadow-md hover:shadow-xl text-white disabled:opacity-75 ${bStyles ? bStyles : ""}`}
			disabled={bDisabled || false}
			type={bType}
			onClick={handleOnClick}
		>
			{bLabel}
		</button>
	);
};
