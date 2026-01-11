import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import routes from "./routes";

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?appName=${process.env.APP_NAME}`;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

app.use("/api", routes);

export const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST"],
		credentials: true,
	},
});

mongoose
	.connect(DB_URI as string)
	.then(() => {
		console.log("✅ Connected to the database");

		const onlineUsers: Record<string, string[]> = {};

		io.use((socket, next) => {
			const cookieHeader = socket.request.headers.cookie;
			const token = cookieHeader
				?.split("; ")
				.find((c) => c.startsWith("token="))
				?.split("=")[1];

			if (!token) return next(new Error("Unauthorized"));
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
					id: string;
				};

				socket.data.userId = decoded.id;
				next();
			} catch (err) {
				console.error(err);
				next(err);
			}
		});
		io.on("connection", (socket) => {
			const userId = socket.data.userId;
			if (!onlineUsers[userId]) onlineUsers[userId] = [];
			onlineUsers[userId].push(socket.id);

			socket.on("private:message", async ({ receiverId, message }) => {
				const sockets = onlineUsers[receiverId] || [];

				console.log("onlineUsers", onlineUsers);
				console.log("sockets", sockets);
				console.log("receiverId", receiverId);

				sockets.forEach((socketId) => {
					io.to(socketId).emit("private:message", message);
				});
			});

			socket.on("disconnect", () => {
				onlineUsers[userId] = onlineUsers[userId].filter(
					(id) => id !== socket.id
				);
				if (onlineUsers[userId].length === 0)
					delete onlineUsers[userId];
			});
		});
		server.listen(3000);
	})
	.catch((error) => {
		console.log("error", error);
	});
