import { useState, useEffect, type ReactNode } from "react";
import { authAPI } from "../../services/api";
import type { LoginCredentials, User } from "../../types";
import { AuthContext } from "./auth.context";

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check for stored auth data on mount
		const storedToken = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");

		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (credentials: LoginCredentials) => {
		const response = await authAPI.login(credentials);
		setUser(response.user);
		setToken(response.token);
		localStorage.setItem("token", response.token);
		localStorage.setItem("user", JSON.stringify(response.user));
	};

	const logout = async () => {
		await authAPI.logout();
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};
