import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// TODO: Implement in Step 2 — User Profile
// router.get('/profile', protect, getProfile);
// router.put('/profile', protect, updateProfile);
// router.put('/preferences', protect, updatePreferences);
// router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
// router.get('/', protect, admin, getAllUsers);           // Admin only

export default router;
