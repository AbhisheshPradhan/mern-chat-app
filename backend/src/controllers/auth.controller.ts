import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "../models/user";

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	if (!user) {
		return res
			.status(404)
			.json({ message: "Invalid username or password" });
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		return res
			.status(400)
			.json({ message: "Invalid username or password" });
	}
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
		expiresIn: "1d",
	});
	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	res.status(200).json({ username, avatar: user.avatar });
};

const signUp = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		if (await User.findOne({ username })) {
			return res.status(409).json({ message: "Username already exists" });
		}

		const newUser = new User({
			username,
			password: hashedPassword,
			avatar: `https://ui-avatars.com/api/?name=${username}&background=4F46E5&color=fff`,
			isOnline: true,
		});

		let createdUser = await newUser.save();

		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
			expiresIn: "1d",
		});
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		res.status(201).json({ username, avatar: createdUser.avatar });
	} catch (error) {
		console.error("Error in signUp: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

const logout = async (req: Request, res: Response) => {
	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
	});

	res.status(200).json({ message: "Logged out" });
};

const me = async (req, res) => {
	let userId = req.userId;
	const user = await User.findById(userId).select("username avatar");
	res.json(user);
};

export const authController = { login, signUp, logout, me };
