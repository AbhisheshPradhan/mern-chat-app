export interface User {
	id: string;
	username: string;
	email: string;
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
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}
