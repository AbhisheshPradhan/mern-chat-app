import { Response } from "express";
import mongoose from "mongoose";

import { Message } from "../models/message";
import { AuthRequest } from "../types";
import Conversation from "../models/conversation";

const sendMessage = async (req: AuthRequest, res: Response) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const loggedInUserId = req.userId;
		const { receiverId, content } = req.body;
		const conversationKey = [loggedInUserId, receiverId].sort().join("_");

		const conversation = await Conversation.findOne({
			conversationKey,
		}).session(session);
		if (!conversation) {
			await session.abortTransaction();
			session.endSession();
			return res
				.status(404)
				.json({ message: "Conversation does not exist" });
		}

		const [newMessage] = await Message.create(
			[
				{
					senderId: loggedInUserId,
					receiverId: receiverId,
					content,
					isRead: false,
				},
			],
			{ session }
		);

		await Conversation.findOneAndUpdate(
			{
				conversationKey,
			},
			{ $push: { messages: newMessage._id } },
			{ new: true, session }
		).populate({
			path: "messages",
		});

		await session.commitTransaction();
		session.endSession();
		res.status(200).json(newMessage);
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error in sendMessage: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const messageController = { sendMessage };
