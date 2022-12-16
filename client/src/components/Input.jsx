export const Input = ({ iLabel, iIcon, iType, iName, iPlaceholder, iValue, handleOnChange, iDisabled }) => {
	return (
		<div className={`grid grid-cols-1 gap-2 my-3 ${iDisabled ? "opacity-75" : ""}`}>
			<label className="font-bold text-gray-600">{iLabel}</label>
			<div className="relative">
				{iIcon ? iIcon : <></>}
				<input
					className={`rounded w-full p-2 border-blue-500 border focus:border-blue-600 disable:opacity-75 text-gray-600 ${iIcon ? "pl-8" : ""}`}
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
