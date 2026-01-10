import { Router } from "express";
import { messageController } from "../controllers/message.controller";

const messagesRoutes = Router();

messagesRoutes.post("/", messageController.sendMessage);

export default messagesRoutes;
