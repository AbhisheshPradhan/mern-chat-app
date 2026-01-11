import { io } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket = io(URL, {
	autoConnect: false,
	withCredentials: true,
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});
