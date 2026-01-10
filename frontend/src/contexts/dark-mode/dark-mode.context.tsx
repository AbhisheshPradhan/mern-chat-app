import { createContext, useContext } from "react";

interface DarkModeContextType {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType | undefined>(
	undefined
);

export const useDarkMode = () => {
	const context = useContext(DarkModeContext);
	if (!context) {
		throw new Error("useDarkMode must be used within DarkModeProvider");
	}
	return context;
};
