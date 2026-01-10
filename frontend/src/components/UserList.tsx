import { useState, useEffect } from "react";
import { userAPI } from "../services/api";
import type { User } from "../types";

interface UserListProps {
	selectedUserId: string | null;
	onSelectUser: (userId: string) => void;
}

export const UserList = ({ selectedUserId, onSelectUser }: UserListProps) => {
	const [users, setUsers] = useState<User[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
		try {
			setIsLoading(true);
			const data = await userAPI.getUsers();
			setUsers(data);
		} catch (error) {
			console.error("Failed to load users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async (query: string) => {
		setSearchQuery(query);
		if (query.trim()) {
			try {
				const data = await userAPI.searchUsers(query);
				setUsers(data);
			} catch (error) {
				console.error("Failed to search users:", error);
			}
		} else {
			loadUsers();
		}
	};

	const formatLastSeen = (date?: Date) => {
		if (!date) return "";
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	};

	return (
		<div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
			<div className="p-4 border-b border-gray-200 dark:border-gray-700">
				<div className="relative">
					<input
						type="text"
						placeholder="Search users..."
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition"
					/>
					<svg
						className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<div className="flex items-center justify-center h-32">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
					</div>
				) : users.length === 0 ? (
					<div className="text-center py-8 text-gray-500 dark:text-gray-400">
						No users found
					</div>
				) : (
					<div className="divide-y divide-gray-200 dark:divide-gray-700">
						{users.map((user) => (
							<button
								key={user.id}
								onClick={() => onSelectUser(user.id)}
								className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
									selectedUserId === user.id
										? "bg-indigo-50 dark:bg-indigo-900/20"
										: ""
								}`}
							>
								<div className="relative">
									<img
										src={user.avatar}
										alt={user.username}
										className="w-12 h-12 rounded-full"
									/>
									{user.isOnline && (
										<span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
									)}
								</div>
								<div className="flex-1 text-left">
									<div className="font-medium text-gray-900 dark:text-white">
										{user.username}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{user.isOnline ? (
											<span className="text-green-600 dark:text-green-400">
												Online
											</span>
										) : (
											<span>
												Last seen{" "}
												{formatLastSeen(user.lastSeen)}
											</span>
										)}
									</div>
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
