export const Input = ({ iLabel, iIcon, iType, iName, iPlaceholder, iValue, handleOnChange, iDisabled }) => {
	return (
		<div className="grid grid-cols-1 gap-2 my-3">
			<label className="font-bold">{iLabel}</label>
			<div className="relative">
				{iIcon}
				<input
					className="rounded w-full p-2 border-blue-500 border focus:border-blue-600 pl-8 disable:opacity-75"
					type={iType}
					id={iName}
					name={iName}
					placeholder={iPlaceholder}
					value={iValue}
					onChange={handleOnChange}
					disabled={iDisabled || false}
				/>
			</div>
		</div>
	);
};
