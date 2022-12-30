// Icons
import { XCircleIcon } from "@heroicons/react/24/solid";

export const PopupMessage = ({ pType, pShow, pClose, pMessage, pStyles }) => {

  let defaultWrapperStyles = "my-3 p-1 rounded border flex gap-2 justify-center flex-row-reverse"
  let iconStyles = "h-5 w-5 "

  if (pType === "error") {
    defaultWrapperStyles += " bg-pink-200 border-pink-500 text-pink-700"
    iconStyles += "hover:text-pink-600"
  }

  if (pType === "success") {
    defaultWrapperStyles += " bg-green-200 border-green-500 text-green-700"
    iconStyles += "hover:text-green-600"
  }

  if (pType === "warning") {
    defaultWrapperStyles += " bg-yellow-200 border-yellow-500 text-yellow-700"
    iconStyles += "hover:text-yellow-600"
  }

	return pShow ? (
    <div className={defaultWrapperStyles}>
      <p className="flex-none">
        <XCircleIcon
          className={iconStyles}
          style={{ cursor: "pointer" }}
          onClick={pClose}
        />
      </p>
      <p className="flex-auto text-center" style={{ whiteSpace: "pre-line" }}>{pMessage}</p>
    </div>
	) : (
		<></>
	);
};
