// Routing
import { Route, Routes, Navigate } from "react-router-dom";

// Third Party
import { QueryClient, QueryClientProvider } from "react-query";
import { useSelector } from "react-redux";

// Components
import { Layout } from "./components/Layout";

// Pages
import { SignIn } from "./pages/Sign-In";
import { SignUp } from "./pages/Sign-Up";
import { Settings } from "./pages/Settings";
import { PasswordChange } from "./pages/Password-Change";
import { PageNotFound } from "./pages/PageNotFound";
import { PasswordReset } from "./pages/Password-Reset"
import { PasswordResetRequest } from "./pages/Password-Reset-Request";
import { PasswordResetConfirm } from "./pages/Password-Reset-Confirm";

const queryClient = new QueryClient();

export const App = () => {
	const isAuthenticated = useSelector((state) => state.isAuthenticated);
	return (
		<QueryClientProvider client={queryClient}>
			<Layout>
				<Routes>
					{isAuthenticated ? (
						<>
							<Route path="/" element={<Navigate to={"/settings"} />} />
							<Route path="/settings/" element={<Settings />} />
							<Route path="/password-change/" element={<PasswordChange />} />
						</>
					) : (
						<>
							<Route path="/" element={<Navigate to={"/sign-in"} />} />
							<Route path="/sign-in/" element={<SignIn />} />
							<Route path="/sign-up/" element={<SignUp />} />
							<Route path="/password-reset/:userId/:token/" element={<PasswordReset />} />
							<Route path="/password-reset-request/" element={<PasswordResetRequest />} />
							<Route path="/password-reset-confirm/" element={<PasswordResetConfirm />} />
						</>
					)}
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</Layout>
		</QueryClientProvider>
	);
};
