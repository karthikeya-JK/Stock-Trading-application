import express from 'express';
import { placeOrder, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getUserOrders);
router.get('/all', protect, adminOnly, getAllOrders);

export default router;
