import { Router } from "express";
import { conversationController } from "../controllers/conversation";

const router = Router();

router.post("/", conversationController.createConversation);

export default router;
