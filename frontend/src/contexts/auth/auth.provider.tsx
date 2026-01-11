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
			.then((res) => {
				console.log("me res", res);
				setUser(res);
			})
			.catch(() => setUser(null))
			.finally(() => setIsLoading(false));
	}, []);

	const login = async (credentials: LoginCredentials) => {
		await authAPI
			.login(credentials)
			.then((res) => {
				console.log("login res", res);
				setUser(res.user);
			})
			.catch(() => setUser(null))
			.finally(() => setIsLoading(false));
	};

	const signup = async (credentials: LoginCredentials) => {
		await authAPI
			.signUp(credentials)
			.then((res) => {
				setUser(res.user);
			})
			.catch(() => setUser(null))
			.finally(() => setIsLoading(false));
	};

	const logout = async () => {
		await authAPI.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, login, signup, logout, isLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
};
