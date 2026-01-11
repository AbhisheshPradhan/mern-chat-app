import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", userController.getUsers);

export default router;
