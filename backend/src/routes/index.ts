import { Router } from "express";
import authRoutes from "./auth";

const router = Router();

router.use("/auth", authRoutes);
// router.use("/users", usersRoutes); // future features

export default router;