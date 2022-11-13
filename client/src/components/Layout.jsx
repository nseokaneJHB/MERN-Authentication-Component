// Components
import { Navigation } from "./Navigation"

export const Layout = ({ children }) => {
  return (
	<main className="h-screen">
		<Navigation />
		{ children }
	</main>
  )
}
