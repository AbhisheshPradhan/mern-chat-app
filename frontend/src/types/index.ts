export interface User {
	_id: string;
	username: string;
	avatar?: string;
	isOnline: boolean;
	lastSeen?: Date;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	isRead: boolean;
	createdAt: string;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface AuthResponse {
	user: User;
}
