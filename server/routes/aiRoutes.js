import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// TODO: Implement in Step 8 — AI Stylist
// router.post('/stylist', protect, chatWithStylist);              // AI conversational stylist
// router.post('/visual-search', protect, upload.single('image'), visualSearch);  // Image-based search
// router.get('/recommendations', protect, getRecommendations);   // Personalized outfit recs

export default router;
