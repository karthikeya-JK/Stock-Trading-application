import express from 'express';
import { getUserTransactions, getAllTransactions } from '../controllers/transactionController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserTransactions);
router.get('/all', protect, adminOnly, getAllTransactions);

export default router;
