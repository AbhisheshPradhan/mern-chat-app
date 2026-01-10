import { Request, Response } from "express";

import { User } from "../models/user";

const getUsers = async (req: Request, res: Response) => {
	console.log("getUsers");
	try {
		// const loggedInUserId = req.user._id;

		const filter = req.query.filter as string | undefined;

		const query = filter
			? { username: { $regex: filter, $options: "i" } }
			: {};

		const users = await User.find(query).select("-password");

		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const userController = { getUsers };
