import mongoose from 'mongoose';

const transactionsSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User email or ID
  type: { type: String, required: true }, // 'BUY', 'SELL', 'DEPOSIT', 'WITHDRAW'
  paymentMode: { type: String, required: true }, // 'wallet', 'bank', etc.
  amount: { type: Number, required: true },
  time: { type: String, required: true, default: () => new Date().toISOString() }
});

const Transaction = mongoose.models.transactions || mongoose.model('transactions', transactionsSchema);

export default Transaction;
