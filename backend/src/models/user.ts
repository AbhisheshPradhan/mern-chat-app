import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true },
		avatar: { type: String, required: true },
		isOnline: { type: Boolean, required: true },
		lastSeen: { type: String, required: false },
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
