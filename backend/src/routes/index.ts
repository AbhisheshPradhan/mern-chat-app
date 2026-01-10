import { Router } from "express";

import userRoutes from "./users.routes";
import conversationRoutes from "./conversations.routes";
import messageRoutes from "./messages.routes";
import authRoutes from "./auth.routes";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use("/users", authenticate, userRoutes);
router.use("/conversations", authenticate, conversationRoutes);
router.use("/messages", authenticate, messageRoutes);

router.use("/auth", authRoutes);

export default router;
