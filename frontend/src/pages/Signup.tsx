import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/auth/auth.context";

export const Signup = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { signup } = useAuth();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);

		try {
			await signup({ username, password });
		} catch (err) {
			setError("Failed to create account. Username may already exist.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900 px-4">
			<div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
				<div>
					<h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
						Chat App
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
						Create a new account
					</p>
				</div>
				<form
					className="mt-8 space-y-6"
					onSubmit={handleSubmit}
				>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Username
							</label>
							<input
								id="username"
								name="username"
								type="text"
								autoComplete="username"
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 transition"
								placeholder="Choose a username"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 transition"
								placeholder="Choose a password"
							/>
						</div>
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 transition"
								placeholder="Confirm your password"
							/>
						</div>
					</div>

					{error && (
						<div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
							{error}
						</div>
					)}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? "Creating account..." : "Sign up"}
						</button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Already have an account?{" "}
							<Link
								to="/"
								className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
							>
								Login
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};
