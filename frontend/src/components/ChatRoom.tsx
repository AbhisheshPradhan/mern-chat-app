import { useState, useEffect, useRef } from "react";
import { conversationAPI, messageAPI, userAPI } from "../services/services";
import { useAuth } from "../contexts/auth/auth.context";
import type { Message, User } from "../types";
import { socket } from "../socket";

interface ChatRoomProps {
	selectedUserId: string;
}

export const ChatRoom = ({ selectedUserId }: ChatRoomProps) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { user: currentUser } = useAuth();

	useEffect(() => {
		loadMessages();
		loadSelectedUser();

		const handleNewMessage = (message: Message) => {
			if (message.senderId == selectedUserId) {
				setMessages((prev) => [...prev, message]);
			}
		};

		socket.on("private:message", handleNewMessage);

		// Cleanup on unmount
		return () => {
			socket.off("private:message", handleNewMessage);
		};
	}, [selectedUserId]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const loadMessages = async () => {
		try {
			setIsLoading(true);
			const data = await conversationAPI.getOrCreateConversation(
				selectedUserId
			);
			setMessages(data.messages);
		} catch (error) {
			console.error("Failed to load messages:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const loadSelectedUser = async () => {
		try {
			const users = await userAPI.getUsers();
			const user = users.find((u) => u._id === selectedUserId);
			setSelectedUser(user || null);
		} catch (error) {
			console.error("Failed to load user:", error);
		}
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || isSending) return;

		try {
			setIsSending(true);
			await messageAPI
				.sendMessage({
					receiverId: selectedUserId,
					content: newMessage.trim(),
				})
				.then((message) => {
					setMessages((prev) => [...prev, message]);
					setNewMessage("");
					socket.emit("private:message", {
						receiverId: selectedUserId,
						message,
					} as { receiverId: string; message: Message });
				});
		} catch (error) {
			console.error("Failed to send message:", error);
		} finally {
			setIsSending(false);
		}
	};

	const formatTime = (date: string) => {
		return new Date(date).toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	if (!selectedUser) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
					<p className="mt-2 text-gray-500 dark:text-gray-400">
						Loading...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
				<div className="flex items-center space-x-3">
					<div className="relative">
						<img
							src={selectedUser.avatar}
							alt={selectedUser.username}
							className="w-10 h-10 rounded-full"
						/>
						{selectedUser.isOnline && (
							<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
						)}
					</div>
					<div>
						<h3 className="font-semibold text-gray-900 dark:text-white">
							{selectedUser.username}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{selectedUser.isOnline ? "Online" : "Offline"}
						</p>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-6 space-y-4">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
					</div>
				) : messages.length === 0 ? (
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<svg
								className="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
							<p className="mt-2 text-gray-500 dark:text-gray-400">
								No messages yet. Start the conversation!
							</p>
						</div>
					</div>
				) : (
					<>
						{messages.map((message) => {
							const isOwnMessage =
								message.senderId === currentUser?._id;
							return (
								<div
									key={message._id}
									className={`flex ${
										isOwnMessage
											? "justify-end"
											: "justify-start"
									}`}
								>
									<div
										className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
											isOwnMessage
												? "bg-indigo-600 text-white"
												: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
										}`}
									>
										<p className="break-words">
											{message.content}
										</p>
										<p
											className={`text-xs mt-1 ${
												isOwnMessage
													? "text-indigo-200"
													: "text-gray-500 dark:text-gray-400"
											}`}
										>
											{formatTime(message.createdAt)}
										</p>
									</div>
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</>
				)}
			</div>

			<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
				<form
					onSubmit={handleSendMessage}
					className="flex space-x-2"
				>
					<input
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type a message..."
						disabled={isSending}
						className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition"
					/>
					<button
						type="submit"
						disabled={!newMessage.trim() || isSending}
						className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isSending ? (
							<svg
								className="animate-spin h-5 w-5"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						) : (
							"Send"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};
