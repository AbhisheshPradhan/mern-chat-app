import { Router } from "express";
import { conversationController } from "../controllers/conversation.controller";

const router = Router();

router.post("/", conversationController.getOrCreateConversation);

export default router;
