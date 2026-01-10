import { useState, useEffect, type ReactNode } from "react";
import { authAPI } from "../../services/services";
import type { LoginCredentials, User } from "../../types";
import { AuthContext } from "./auth.context";

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		authAPI
			.me()
			.then((res) => setUser(res))
			.catch(() => setUser(null))
			.finally(() => setIsLoading(false));
	}, []);

	const login = async (credentials: LoginCredentials) => {
		const response = await authAPI.login(credentials);
		setUser(response.user);
	};

	const signup = async (credentials: LoginCredentials) => {
		const response = await authAPI.signUp(credentials);
		setUser(response.user);
	};

	const logout = async () => {
		await authAPI.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};
