import { Router } from "express";
import { messageController } from "../controllers/message";

const messagesRoutes = Router();

messagesRoutes.post("/", messageController.sendMessage);

export default messagesRoutes;
