import { useEffect, useState, type ReactNode } from "react";
import { DarkModeContext } from "./dark-mode.context";

interface DarkModeProviderProps {
	children: ReactNode;
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const stored = localStorage.getItem("darkMode");
		return stored ? JSON.parse(stored) : false;
	});

	useEffect(() => {
		const root = window.document.documentElement;
		if (isDarkMode) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode((prev: boolean) => !prev);
	};

	return (
		<DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</DarkModeContext.Provider>
	);
};
