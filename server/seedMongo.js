import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import UserMongoose from './models/userModel.js';
import StockMongoose from './models/stocksSchema.js';
import OrderMongoose from './models/orderSchema.js';
import TransactionMongoose from './models/transactionModel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sb-stocks';

const seedDatabaseForCompass = async () => {
  console.log('🚀 Starting MongoDB Compass Database Seeder & Synchronization...');
  console.log(`📡 Connecting to MongoDB instance at: ${MONGO_URI}`);

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected successfully to MongoDB!');

    // 1. Clear existing sample collections to ensure clean seed structure
    console.log('🧹 Synchronizing collections: Users, Stocks, Orders, Transactions...');
    await UserMongoose.deleteMany({});
    await StockMongoose.deleteMany({});
    await OrderMongoose.deleteMany({});
    await TransactionMongoose.deleteMany({});

    // 2. Seed Admin and Sample User
    const adminUser = await UserMongoose.create({
      username: 'admin',
      email: 'admin@sbstocks.com',
      password: 'password123',
      userType: 'Admin',
      balance: 100000
    });

    const regularUser = await UserMongoose.create({
      username: 'JohnTrader',
      email: 'user@sbstocks.com',
      password: 'password123',
      userType: 'User',
      balance: 50075.50
    });

    console.log('👥 Created Users: admin@sbstocks.com & user@sbstocks.com');

    // 3. Seed Market Stock Holdings for User
    const sampleStocks = [
      {
        userId: regularUser._id.toString(),
        stockSymbol: 'AAPL',
        stockName: 'Apple Inc.',
        price: 175.50,
        count: 50,
        totalPrice: 8775.00,
        stockExchange: 'NASDAQ'
      },
      {
        userId: regularUser._id.toString(),
        stockSymbol: 'NVDA',
        stockName: 'NVIDIA Corporation',
        price: 875.12,
        count: 10,
        totalPrice: 8751.20,
        stockExchange: 'NASDAQ'
      },
      {
        userId: regularUser._id.toString(),
        stockSymbol: 'MSFT',
        stockName: 'Microsoft Corporation',
        price: 415.20,
        count: 25,
        totalPrice: 10380.00,
        stockExchange: 'NASDAQ'
      }
    ];

    await StockMongoose.insertMany(sampleStocks);
    console.log('💼 Seeded virtual portfolio holdings for User.');

    // 4. Seed Orders (Intraday & Delivery)
    const sampleOrders = [
      {
        userId: regularUser._id.toString(),
        username: regularUser.username,
        email: regularUser.email,
        stockSymbol: 'NVDA',
        stockName: 'NVIDIA Corporation',
        orderType: 'Buy',
        productType: 'Intraday',
        quantity: 2,
        price: 174.98,
        totalPrice: 349.96,
        status: 'Completed'
      },
      {
        userId: regularUser._id.toString(),
        username: regularUser.username,
        email: regularUser.email,
        stockSymbol: 'AAPL',
        stockName: 'Apple Inc.',
        orderType: 'Buy',
        productType: 'Delivery',
        quantity: 15,
        price: 175.00,
        totalPrice: 2625.00,
        status: 'Completed'
      },
      {
        userId: regularUser._id.toString(),
        username: regularUser.username,
        email: regularUser.email,
        stockSymbol: 'TSLA',
        stockName: 'Tesla Inc.',
        orderType: 'Sell',
        productType: 'Intraday',
        quantity: 5,
        price: 171.50,
        totalPrice: 857.50,
        status: 'Completed'
      }
    ];

    await OrderMongoose.insertMany(sampleOrders);
    console.log('📜 Seeded trading orders into Orders collection.');

    // 5. Seed Transactions (History & Wallet Logs)
    const sampleTransactions = [
      {
        userId: regularUser._id.toString(),
        stockSymbol: 'NVDA',
        stockName: 'NVIDIA Corporation',
        transactionType: 'Buy',
        paymentMode: 'Wallet',
        amount: 349.96,
        status: 'Success'
      },
      {
        userId: regularUser._id.toString(),
        stockSymbol: 'AAPL',
        stockName: 'Apple Inc.',
        transactionType: 'Buy',
        paymentMode: 'Wallet',
        amount: 2625.00,
        status: 'Success'
      },
      {
        userId: regularUser._id.toString(),
        stockSymbol: 'FUND_DEPOSIT',
        stockName: 'Account Funding',
        transactionType: 'Deposit',
        paymentMode: 'Bank Transfer',
        amount: 10000.00,
        status: 'Success'
      }
    ];

    await TransactionMongoose.insertMany(sampleTransactions);
    console.log('💳 Seeded ledger transactions into Transactions collection.');

    // 6. Ensure market_stocks.json is present and written
    const marketStocksPath = path.join(process.cwd(), 'data', 'market_stocks.json');
    if (!fs.existsSync(marketStocksPath)) {
      const defaultStocks = [
        { _id: 's1', symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 1.25, high: 178.00, low: 174.12, volume: 52000000 },
        { _id: 's2', symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.20, change: -2.40, high: 420.50, low: 412.00, volume: 22000000 },
        { _id: 's3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 150.80, change: 0.85, high: 152.00, low: 149.50, volume: 28000000 },
        { _id: 's4', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.10, change: -1.10, high: 180.12, low: 176.50, volume: 35000000 },
        { _id: 's5', symbol: 'TSLA', name: 'Tesla Inc.', price: 170.20, change: -4.50, high: 176.80, low: 168.20, volume: 84000000 },
        { _id: 's6', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.12, change: 12.30, high: 885.00, low: 860.20, volume: 48000000 }
      ];
      fs.writeFileSync(marketStocksPath, JSON.stringify(defaultStocks, null, 2), 'utf8');
    }

    console.log('\n🌟 SUCCESS! Database seeded and ready for inspection in MongoDB Compass.');
    console.log(`👉 Open MongoDB Compass and connect to: ${MONGO_URI}`);
    console.log('📊 You will now see the "sb-stocks" database with "users", "stocks", "orders", and "transactions" collections!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB Seeder Error:', error.message);
    console.error('💡 Please make sure MongoDB Server is running on port 27017 or MongoDB Compass connection is active before running seed.');
    process.exit(1);
  }
};

seedDatabaseForCompass();
