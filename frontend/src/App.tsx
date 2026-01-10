import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Chat } from "./pages/Chat";
import { DarkModeProvider } from "./contexts/dark-mode/dark-mode.provider";
import { AuthProvider } from "./contexts/auth/auth.provider";
import { useAuth } from "./contexts/auth/auth.context";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return user ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return !user ? <>{children}</> : <Navigate to="/chat" replace />;
}

function App() {
	return (
		<DarkModeProvider>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route
							path="/"
							element={
								<PublicRoute>
									<Login />
								</PublicRoute>
							}
						/>
						<Route
							path="/signup"
							element={
								<PublicRoute>
									<Signup />
								</PublicRoute>
							}
						/>
						<Route
							path="/chat"
							element={
								<ProtectedRoute>
									<Chat />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</DarkModeProvider>
	);
}

export default App;
