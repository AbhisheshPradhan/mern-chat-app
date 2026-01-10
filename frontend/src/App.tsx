import { Login } from "./pages/Login";
import { Chat } from "./pages/Chat";
import { DarkModeProvider } from "./contexts/dark-mode/dark-mode.provider";
import { AuthProvider } from "./contexts/auth/auth.provider";
import { useAuth } from "./contexts/auth/auth.context";

function AppContent() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return user ? <Chat /> : <Login />;
}

function App() {
	return (
		<DarkModeProvider>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</DarkModeProvider>
	);
}

export default App;
