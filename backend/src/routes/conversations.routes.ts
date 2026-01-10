import { Router } from "express";
import { conversationController } from "../controllers/conversation.controller";

const router = Router();

router.post("/", conversationController.createConversation);

export default router;
