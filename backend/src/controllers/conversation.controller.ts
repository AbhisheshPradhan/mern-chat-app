import { Request, Response } from "express";

import Conversation from "../models/conversation";
import { AuthRequest } from "../types";

const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
	try {
		const loggedInUserId = req.userId;
		const { receiverId } = req.body;
		const conversationKey = [loggedInUserId, receiverId].sort().join("_");

		const conversationRes = await Conversation.findOne({
			conversationKey,
		})
			.select("-conversationKey")
			.populate({
				path: "messages",
				select: "_id senderId receiverId content isRead createdAt",
			});

		if (conversationRes) {
			return res.status(200).json({
				participants: conversationRes.participants,
				messages: conversationRes.messages,
			});
		}

		const createdConversationRes = await Conversation.create({
			conversationKey,
			participants: [loggedInUserId, receiverId],
		});

		return res.status(201).json({
			participants: createdConversationRes.participants,
			messages: createdConversationRes.messages,
		});
	} catch (error) {
		console.error("Error in getOrCreateConversation: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const conversationController = { getOrCreateConversation };
