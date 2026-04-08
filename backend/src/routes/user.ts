import express from 'express';
import { UserController } from '../controllers/user';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Admin-only routes (create, list, manage users)
router.post('/', authorizeAdmin, UserController.create);
router.get('/', authorizeAdmin, UserController.getAll);
router.get('/:id', authorizeAdmin, UserController.getById);

// User can edit/delete own profile or admin can edit/delete any user
router.patch('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;