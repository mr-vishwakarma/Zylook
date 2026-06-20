import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin, creator } from '../middleware/admin.js';

const router = express.Router();

// TODO: Implement in Step 3 — Outfit Catalog
// router.get('/', getOutfits);                                    // Public — browse with filters
// router.get('/featured', getFeaturedOutfits);                    // Public — homepage feed
// router.get('/search', searchOutfits);                           // Public — text search
// router.get('/:id', getOutfitById);                              // Public — outfit detail
// router.post('/', protect, creator, createOutfit);               // Creator/Admin
// router.put('/:id', protect, creator, updateOutfit);             // Creator/Admin
// router.delete('/:id', protect, admin, deleteOutfit);            // Admin only

export default router;
