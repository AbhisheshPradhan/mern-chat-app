import { Request, Response } from "express";

import Conversation from "../models/conversation";

const createConversation = async (req: Request, res: Response) => {
	console.log("createConversation");
	try {
		// const loggedInUserId = req.user._id;

		const createdConversationRes = await Conversation.create(req.body);

		res.status(201).json(createdConversationRes);
	} catch (error) {
		console.error("Error in createConversation: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const conversationController = { createConversation };
