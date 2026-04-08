import express from 'express';
import { UserController } from '../controllers/user';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and admin permissions
router.use(authenticateToken);
router.use(authorizeAdmin);

// User CRUD routes
router.post('/', UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;