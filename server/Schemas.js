import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { isMockDatabase } from './config/db.js';
import UserMongoose from './models/userModel.js';
import StockMongoose from './models/stocksSchema.js';
import OrderMongoose from './models/orderSchema.js';
import TransactionMongoose from './models/transactionModel.js';

class MockDocument {
  constructor(modelName, data) {
    Object.assign(this, data);
    Object.defineProperty(this, '_modelName', { value: modelName, enumerable: false });
  }

  async save() {
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, `${this._modelName}.json`);
    let records = [];
    if (fs.existsSync(filePath)) {
      records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    const idx = records.findIndex(r => r._id === this._id);
    const plainData = { ...this };
    
    if (idx !== -1) {
      records[idx] = plainData;
    } else {
      records.push(plainData);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), 'utf8');
    return this;
  }
}

class MockQuery {
  constructor(results) {
    this.results = results;
  }

  sort(sortObj) {
    const key = Object.keys(sortObj)[0];
    const dir = sortObj[key];
    this.results.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      // handle string dates / times
      if (key === 'time' || key === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return dir === -1 ? 1 : -1;
      if (valA > valB) return dir === -1 ? -1 : 1;
      return 0;
    });
    return this;
  }

  limit(num) {
    this.results = this.results.slice(0, num);
    return this;
  }

  then(resolve) {
    resolve(this.results);
  }
}

class MockModel {
  constructor(name, defaultData = []) {
    this.name = name;
    // Seed default data if file doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, `${name}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
    }
  }

  _read() {
    const filePath = path.join(process.cwd(), 'data', `${this.name}.json`);
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      return [];
    }
  }

  _write(data) {
    const filePath = path.join(process.cwd(), 'data', `${this.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  _match(record, query) {
    if (!query || Object.keys(query).length === 0) return true;
    for (const key in query) {
      if (query[key] !== record[key]) return false;
    }
    return true;
  }

  async find(query = {}) {
    const records = this._read();
    const matched = records.filter(r => this._match(r, query)).map(r => new MockDocument(this.name, r));
    return new MockQuery(matched);
  }

  async findOne(query = {}) {
    const records = this._read();
    const found = records.find(r => this._match(r, query));
    return found ? new MockDocument(this.name, found) : null;
  }

  async findById(id) {
    const records = this._read();
    const found = records.find(r => r._id === id);
    return found ? new MockDocument(this.name, found) : null;
  }

  async create(data) {
    const records = this._read();
    const newDoc = {
      _id: crypto.randomBytes(12).toString('hex'),
      ...data
    };
    records.push(newDoc);
    this._write(records);
    return new MockDocument(this.name, newDoc);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const records = this._read();
    const idx = records.findIndex(r => r._id === id);
    if (idx === -1) return null;
    
    // Apply updates
    const updatedRecord = { ...records[idx], ...update };
    records[idx] = updatedRecord;
    this._write(records);
    return new MockDocument(this.name, updatedRecord);
  }

  async updateOne(query, update) {
    const records = this._read();
    const idx = records.findIndex(r => this._match(r, query));
    if (idx === -1) return { nModified: 0 };
    
    records[idx] = { ...records[idx], ...update };
    this._write(records);
    return { nModified: 1 };
  }

  async deleteOne(query) {
    const records = this._read();
    const idx = records.findIndex(r => this._match(r, query));
    if (idx === -1) return { deletedCount: 0 };
    
    records.splice(idx, 1);
    this._write(records);
    return { deletedCount: 1 };
  }

  async deleteMany(query) {
    const records = this._read();
    const remaining = records.filter(r => !this._match(r, query));
    const deletedCount = records.length - remaining.length;
    this._write(remaining);
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    const records = this._read();
    return records.filter(r => this._match(r, query)).length;
  }
}

// Global stocks seed data (stocks list)
const defaultStocksSeed = [
  { _id: 's1', symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 1.25, high: 178.00, low: 174.12, volume: 52000000 },
  { _id: 's2', symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.20, change: -2.40, high: 420.50, low: 412.00, volume: 22000000 },
  { _id: 's3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 150.80, change: 0.85, high: 152.00, low: 149.50, volume: 28000000 },
  { _id: 's4', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.10, change: -1.10, high: 180.12, low: 176.50, volume: 35000000 },
  { _id: 's5', symbol: 'TSLA', name: 'Tesla Inc.', price: 170.20, change: -4.50, high: 176.80, low: 168.20, volume: 84000000 },
  { _id: 's6', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.12, change: 12.30, high: 885.00, low: 860.20, volume: 48000000 },
  { _id: 's7', symbol: 'NFLX', name: 'Netflix Inc.', price: 610.50, change: 3.15, high: 615.00, low: 602.80, volume: 5000000 },
  { _id: 's8', symbol: 'META', name: 'Meta Platforms', price: 495.30, change: -0.90, high: 502.10, low: 491.50, volume: 18000000 }
];

// Initialize Mock instances
const mockUser = new MockModel('users');
const mockStock = new MockModel('stocks'); // user stock holdings
const mockOrder = new MockModel('orders');
const mockTransaction = new MockModel('transactions');

// Wrap models to resolve dynamically based on connection status
export const User = new Proxy({}, {
  get: (target, prop) => isMockDatabase() ? mockUser[prop] : UserMongoose[prop]
});

export const Stock = new Proxy({}, {
  get: (target, prop) => isMockDatabase() ? mockStock[prop] : StockMongoose[prop]
});

export const Order = new Proxy({}, {
  get: (target, prop) => isMockDatabase() ? mockOrder[prop] : OrderMongoose[prop]
});

export const Transaction = new Proxy({}, {
  get: (target, prop) => isMockDatabase() ? mockTransaction[prop] : TransactionMongoose[prop]
});

// A seed stock list store for the global market, used by market updates
export const getMarketStocks = () => {
  const filePath = path.join(process.cwd(), 'data', 'market_stocks.json');
  if (!fs.existsSync(filePath)) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(defaultStocksSeed, null, 2), 'utf8');
    return defaultStocksSeed;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultStocksSeed;
  }
};

export const updateMarketStocks = (stocks) => {
  const filePath = path.join(process.cwd(), 'data', 'market_stocks.json');
  fs.writeFileSync(filePath, JSON.stringify(stocks, null, 2), 'utf8');
};
