import { Response } from "express";

import { User } from "../models/user";
import { AuthRequest } from "../types";

const getUsers = async (req: AuthRequest, res: Response) => {
	try {
		const loggedInUserId = req.userId;

		const filter = req.query.filter as string | undefined;

		const query = {
			_id: { $ne: loggedInUserId },
			...(filter && {
				username: { $regex: filter, $options: "i" },
			}),
		};

		const users = await User.find(query).select(
			"_id username avatar isOnline"
		);

		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const userController = { getUsers };
