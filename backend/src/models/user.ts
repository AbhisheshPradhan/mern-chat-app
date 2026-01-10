import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		avatar: { type: String, required: true },
		isOnline: { type: Boolean, required: false },
		lastSeen: { type: String, required: false },
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
