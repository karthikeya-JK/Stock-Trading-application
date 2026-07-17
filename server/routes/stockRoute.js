import express from 'express';
import { getUserHoldings, getMarketStocksList, getStockDetails, adminUpdateStock, adminAddStock } from '../controllers/stockController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/holdings', protect, getUserHoldings);
router.get('/market', getMarketStocksList);
router.get('/market/:symbol', getStockDetails);
router.put('/market/:symbol', protect, adminOnly, adminUpdateStock);
router.post('/market', protect, adminOnly, adminAddStock);

export default router;
