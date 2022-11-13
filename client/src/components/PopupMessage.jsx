// Icons
import { XCircleIcon } from "@heroicons/react/24/solid";

export const PopupMessage = ({ pType, pShow, pClose, pMessage, pStyles }) => {

  let defaultWrapperStyles = "my-3 p-1 rounded relative border "
  const iconWrapperStyles = pStyles ? pStyles : "absolute top-1 right-2"
  let iconStyles = "h-5 w-5 "

  if (pType === "error") {
    defaultWrapperStyles += "bg-pink-200 border-pink-500 text-pink-700"
    iconStyles += "hover:text-pink-600"
  }

  if (pType === "success") {
    defaultWrapperStyles += "bg-green-200 border-green-500 text-green-700"
    iconStyles += "hover:text-green-600"
  }

	return pShow ? (
    <div className={defaultWrapperStyles}>
      <p className={iconWrapperStyles}>
        <XCircleIcon
          className={iconStyles}
          style={{ cursor: "pointer" }}
          onClick={pClose}
        />
      </p>
      <p className="text-center">{pMessage}</p>
    </div>
	) : (
		<></>
	);
};
