import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { isMockDatabase } from './config/db.js';
import userRoute from './routes/userRoute.js';
import stockRoute from './routes/stockRoute.js';
import orderRoute from './routes/orderRoute.js';
import transactionRoute from './routes/transactionRoute.js';
import { getMarketStocks, updateMarketStocks } from './Schemas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// API routes mapping
app.use('/api/users', userRoute);
app.use('/api/stocks', stockRoute);
app.use('/api/orders', orderRoute);
app.use('/api/transactions', transactionRoute);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'SB Stocks API is running...',
    databaseMode: isMockDatabase() ? 'JSON Mock DB Fallback' : 'MongoDB'
  });
});

// MongoDB Compass Seed / Sync endpoint
app.post('/api/db/seed', async (req, res) => {
  try {
    const { exec } = await import('child_process');
    exec('node seedMongo.js', { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Failed to seed MongoDB. Ensure MongoDB is running on port 27017.', error: error.message });
      }
      res.json({ success: true, message: 'Database successfully seeded for MongoDB Compass!', output: stdout });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Global market stocks price ticker simulator (ticks every 4 seconds)
const startMarketSimulator = () => {
  console.log('📈 Starting Real-time Stock Market Simulator (Ticks every 4s)...');
  
  setInterval(() => {
    try {
      const stocks = getMarketStocks();
      const updated = stocks.map(stock => {
        // Random price fluctuation between -1.5% and +1.5%
        const percentChange = (Math.random() * 3 - 1.5) / 100;
        const priceDiff = stock.price * percentChange;
        const newPrice = Math.max(0.5, Number((stock.price + priceDiff).toFixed(2)));
        
        // High & Low tracker updates
        const high = Math.max(stock.high, newPrice);
        const low = Math.min(stock.low, newPrice);
        const change = Number((percentChange * 100).toFixed(2));
        const volumeDiff = Math.floor(Math.random() * 1000) * 10;
        const volume = stock.volume + volumeDiff;

        return {
          ...stock,
          price: newPrice,
          change,
          high,
          low,
          volume
        };
      });
      
      updateMarketStocks(updated);
    } catch (err) {
      console.error('Error in market simulator tick:', err.message);
    }
  }, 4000);
};

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  startMarketSimulator();
});
