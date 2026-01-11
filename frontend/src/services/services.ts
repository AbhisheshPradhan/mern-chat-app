import type { AuthResponse, LoginCredentials, Message, User } from "../types";
import { api } from "./api";

// Mock data for development
const MOCK_USERS: User[] = [
	{
		id: "1",
		username: "Alice Johnson",
		avatar: "https://ui-avatars.com/api/?name=Alice+Johnson&background=4F46E5&color=fff",
		isOnline: true,
	},
	{
		id: "2",
		username: "Bob Smith",
		avatar: "https://ui-avatars.com/api/?name=Bob+Smith&background=10B981&color=fff",
		isOnline: true,
	},
	{
		id: "3",
		username: "Carol Williams",
		avatar: "https://ui-avatars.com/api/?name=Carol+Williams&background=F59E0B&color=fff",
		isOnline: false,
		lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
	},
	{
		id: "4",
		username: "David Brown",
		avatar: "https://ui-avatars.com/api/?name=David+Brown&background=EF4444&color=fff",
		isOnline: false,
		lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
	},
	{
		id: "5",
		username: "Emma Davis",
		avatar: "https://ui-avatars.com/api/?name=Emma+Davis&background=8B5CF6&color=fff",
		isOnline: true,
	},
];

const MOCK_MESSAGES: { [key: string]: Message[] } = {
	"1": [
		{
			id: "m1",
			senderId: "1",
			receiverId: "current-user",
			content: "Hey! How are you doing?",
			timestamp: new Date(Date.now() - 1000 * 60 * 60),
			read: true,
		},
		{
			id: "m2",
			senderId: "current-user",
			receiverId: "1",
			content: "Hi Alice! I'm doing great, thanks for asking!",
			timestamp: new Date(Date.now() - 1000 * 60 * 55),
			read: true,
		},
		{
			id: "m3",
			senderId: "1",
			receiverId: "current-user",
			content:
				"That's wonderful to hear! Working on anything interesting?",
			timestamp: new Date(Date.now() - 1000 * 60 * 50),
			read: true,
		},
		{
			id: "m4",
			senderId: "current-user",
			receiverId: "1",
			content:
				"Yes! Building a chat application with React and TypeScript.",
			timestamp: new Date(Date.now() - 1000 * 60 * 45),
			read: true,
		},
	],
	"2": [
		{
			id: "m5",
			senderId: "2",
			receiverId: "current-user",
			content: "Did you see the game last night?",
			timestamp: new Date(Date.now() - 1000 * 60 * 30),
			read: true,
		},
		{
			id: "m6",
			senderId: "current-user",
			receiverId: "2",
			content: "No, I missed it. Who won?",
			timestamp: new Date(Date.now() - 1000 * 60 * 25),
			read: true,
		},
	],
	"3": [
		{
			id: "m7",
			senderId: "current-user",
			receiverId: "3",
			content: "Hi Carol! Are you available for a quick call?",
			timestamp: new Date(Date.now() - 1000 * 60 * 40),
			read: false,
		},
	],
};

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Service
export const authAPI = {
	login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		const response = await api.post("/auth/login", credentials);

		return { user: response.data };
	},

	signUp: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		const response = await api.post("/auth/signup", credentials);

		return { user: response.data };
	},

	me: async (): Promise<User> => {
		const response = await api.post("/auth/me", {
			credentials: "include",
		});

		return response.data;
	},

	logout: async (): Promise<void> => {
		const response = await api.post("/auth/logout");

		return response.data;
	},
};

export const userAPI = {
	getUsers: async (): Promise<User[]> => {
		const response = await api.get("/users", {
			withCredentials: true,
		});

		return response.data;
	},

	searchUsers: async (query: string): Promise<User[]> => {
		await delay(300);
		const lowerQuery = query.toLowerCase();
		return MOCK_USERS.filter((user) =>
			user.username.toLowerCase().includes(lowerQuery)
		);
	},
};

export const conversationAPI = {
	getOrCreateConversation: async (
		selectedUserId: string
	): Promise<{ participants: string[]; messages: Message[] }> => {
		const response = await api.post(
			"/conversations",
			{
				receiverId: selectedUserId,
			},
			{ withCredentials: true }
		);

		return response.data;
	},
};

export const messageAPI = {
	sendMessage: async ({
		receiverId,
		content,
	}: {
		receiverId: string;
		content: string;
	}): Promise<Message> => {
		const response = await api.post(
			"/messages",
			{
				receiverId,
				content,
			},
			{ withCredentials: true }
		);

		return response.data;
	},
};
