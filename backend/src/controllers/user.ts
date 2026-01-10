import { Request, Response } from "express";

import { User } from "../models/user";

const getUsers = async (req: Request, res: Response) => {
	console.log("getUsers");
	try {
		// const loggedInUserId = req.user._id;

		const filter = req?.query?.filter || "";
		console.log("getUsers", filter);

		if (filter) {
			const filteredUsers = await User.find({
				username: { $regex: filter as string, $options: "i" },
			}).select("username avatar isOnline lastSeen");
			console.log("filteredUsers", filteredUsers);
			res.status(200).json(filteredUsers);
		} else {
			const allUsers = await User.find().select(
				"username avatar isOnline lastSeen"
			);
			res.status(200).json(allUsers);
		}
	} catch (error) {
		console.error("Error in getUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const userController = { getUsers };
