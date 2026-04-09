import express from 'express';
import multer from 'multer';
import { ArtistController } from '../controllers/artist';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// All routes require authentication
router.use(authenticateToken);

// Artist CRUD routes
router.post('/', ArtistController.create);
router.get('/', ArtistController.getAll);
router.get('/:id', ArtistController.getById);
router.patch('/:id', ArtistController.update);
router.delete('/:id', ArtistController.delete);

// CSV import/export routes
router.get('/export/csv', ArtistController.exportCSV);
router.post('/import/csv', upload.single('file'), ArtistController.importCSV);

export default router;