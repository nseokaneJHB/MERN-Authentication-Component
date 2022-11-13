// Icons
import { GoogleIcon } from "../assets/svg/GoogleIcon"
import { FacebookIcon } from "../assets/svg/FacebookIcon"
import { InstagramIcon } from "../assets/svg/InstagramIcon"
import { TwitterIcon } from "../assets/svg/TwitterIcon"

const defaultIconWrapperStyle = "p-3 w-12 rounded border-blue-500 border shadow-lg hover:bg-blue-600 hover:border-blue-500"

export const SocialsAuthentication = () => {
  return (
	<>
		<h1 className="text-4xl font-bold text-center">Or</h1>
		<hr className="my-2"/>
		<p className="text-center">Join using your favorite social media account</p>
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
