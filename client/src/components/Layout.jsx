import Footer from "./Footer"
import Header from "./Header"
import { Outlet } from "react-router-dom"
function Layout() {
	return (
		<div className="layout">
			<Header />
			{/* Dynamic part of the application */}

			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}

export default Layout
