import { Request, Response } from "express";

import { Message } from "../models/message";

const sendMessage = async (req: Request, res: Response) => {
	console.log("sendMessage req.body", req.body);
	try {
		// const loggedInUserId = req.user._id;

		const newMessage = await Message.create(req.body);

		res.status(200).json(newMessage);

		// when user sends message, trigger socket event for loading new message for receiver
	} catch (error) {
		console.error("Error in sendMessage: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const messageController = { sendMessage };
