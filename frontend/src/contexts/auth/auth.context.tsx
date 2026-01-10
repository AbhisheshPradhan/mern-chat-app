import { createContext, useContext } from "react";
import type { LoginCredentials, User } from "../../types";

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	logout: () => Promise<void>;
	isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
