// Icons
import { GoogleIcon } from "../assets/svg/GoogleIcon"
import { FacebookIcon } from "../assets/svg/FacebookIcon"
import { InstagramIcon } from "../assets/svg/InstagramIcon"
import { TwitterIcon } from "../assets/svg/TwitterIcon"

const defaultIconWrapperStyle = "p-3 w-12 rounded border-blue-500 border shadow-lg hover:bg-blue-600 hover:border-blue-500"

export const SocialsAuthentication = () => {
  return (
	<>
		<div className="flex justify-center align-center gap-1 mb-2 text-gray-600">
			<span className="border border-gray-600 grow h-0 mt-3"></span>
			<small className="text-base text-center flex-none">Or</small>
			<span className="border border-gray-600 grow h-0 mt-3"></span>
		</div>
		<p className="text-center text-gray-600">Join using your favorite social media account</p>
		<div className="flex mt-4 justify-center gap-3">
			<div className={defaultIconWrapperStyle}>
				<GoogleIcon />
			</div>
			<div className={defaultIconWrapperStyle}>
				<FacebookIcon />
			</div>
			<div className={defaultIconWrapperStyle}>
				<InstagramIcon />
			</div>
			<div className={`${defaultIconWrapperStyle}`}>
				<TwitterIcon />
			</div>
		</div>
	</>
  )
}
