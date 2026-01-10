import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import Blog from "./models/blog";
import User from "./models/blog";

import { MOCK_USERS } from "./data/mock-data";

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?appName=${process.env.APP_NAME}`;

console.log("DB_URI:", DB_URI);

const app = express();
app.use(express.json());

mongoose
	.connect(DB_URI as string)
	.then(() => {
		console.log("✅ Connected to the database");
		app.listen(3000);
	})
	.catch((error) => {
		console.log("error", error);
	});

app.get("/add-users", async (req, res) => {
	try {
		// Map each user to a Promise
		const results = await Promise.all(
			MOCK_USERS.map(async (mockUser) => {
				const existingUser = await User.findOne({
					email: mockUser.email,
				});

				if (existingUser) {
					console.log(
						`User with email ${mockUser.email} already exists. Skipping...`
					);
					return { email: mockUser.email, status: "skipped" };
				} else {
					const user = new User({
						username: mockUser.username,
						email: mockUser.email,
						avatar: mockUser.avatar,
						isOnline: mockUser.isOnline,
						lastSeen: mockUser.lastSeen,
					});
					await user.save();
					console.log("Added user:", mockUser.email);
					return { email: mockUser.email, status: "added" };
				}
			})
		);

		// Respond once, after all promises complete
		res.status(201).json({
			message: "User seeding complete",
			results,
		});
	} catch (err) {
		console.error(err);
		res.status(500).send("Error adding users: " + err.message);
	}
});

// app.get("/blogs", (req, res) => {
// 	Blog.find()
// 		.then((blogs) => res.status(200).json(blogs))
// 		.catch((err) =>
// 			res.status(500).send("Error fetching blogs: " + err.message)
// 		);
// });
