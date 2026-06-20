import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// TODO: Implement in Step 3 — Product Management
// router.get('/', getProducts);
// router.get('/:id', getProductById);
// router.post('/', protect, admin, createProduct);
// router.put('/:id', protect, admin, updateProduct);
// router.delete('/:id', protect, admin, deleteProduct);

export default router;
