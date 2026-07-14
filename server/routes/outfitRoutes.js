import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin, creator } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';
import {
  getOutfits,
  getFeaturedOutfits,
  searchOutfits,
  getOutfitById,
  createOutfit,
  updateOutfit,
  deleteOutfit,
} from '../controllers/outfitController.js';

const router = express.Router();

// Public routes
router.get('/', getOutfits);
router.get('/featured', getFeaturedOutfits);
router.get('/search', searchOutfits);
router.get('/:id', getOutfitById);

// Creator / Admin routes
router.post('/', protect, creator, upload.single('coverImage'), createOutfit);
router.put('/:id', protect, creator, upload.single('coverImage'), updateOutfit);

// Admin-only
router.delete('/:id', protect, admin, deleteOutfit);

export default router;
