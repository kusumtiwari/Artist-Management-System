import express from 'express';
import { SongController } from '../controllers/song';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Song CRUD routes
router.post('/', authorizeAdmin, SongController.create);
router.get('/artist/:artistId', authorizeAdmin, SongController.getByArtistId);
router.get('/:id', authorizeAdmin, SongController.getById);
router.patch('/:id', authorizeAdmin, SongController.update);
router.delete('/:id', authorizeAdmin, SongController.delete);
export default router;