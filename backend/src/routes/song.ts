import express from 'express';
import { SongController } from '../controllers/song';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Song CRUD routes
router.post('/', SongController.create);
router.get('/artist/:artistId', SongController.getByArtistId);
router.get('/:id', SongController.getById);
router.patch('/:id', SongController.update);
router.delete('/:id', SongController.delete);

export default router;