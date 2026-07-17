import mongoose from 'mongoose';

const stocksSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User email or ID
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }, // Current stock price or purchase price
  count: { type: Number, required: true }, // Shares quantity
  totalPrice: { type: Number, required: true }, // Total value (price * count)
  stockExchange: { type: String, required: true, default: 'NYSE' }
});

const Stock = mongoose.models.stocks || mongoose.model('stocks', stocksSchema);

export default Stock;
