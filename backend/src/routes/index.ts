import { Router } from "express";
import authRoutes from "./auth";
import artistRoutes from "./artist";
import songRoutes from "./song";
import userRoutes from "./user";

const router = Router();

router.use('/auth', authRoutes);
router.use('/artists', artistRoutes);
router.use('/songs', songRoutes);
router.use('/users', userRoutes);

export default router;