export interface User {
	id: string;
	username: string;
	avatar?: string;
	isOnline: boolean;
	lastSeen?: Date;
}

export interface Message {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: Date;
	read: boolean;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface AuthResponse {
	user: User;
}
