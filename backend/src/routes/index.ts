import { Router } from "express";

import userRoutes from "./users";
import conversationRoutes from "./conversations";
import messageRoutes from "./messages";

const router = Router();

router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);

export default router;
