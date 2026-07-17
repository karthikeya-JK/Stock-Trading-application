import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User email or ID
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  stockType: { type: String, required: true }, // 'intraday' or 'delivery'
  orderType: { type: String, required: true }, // 'buy' or 'sell'
  orderStatus: { type: String, required: true, default: 'completed' }, // 'completed', 'pending', 'cancelled'
  time: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const Order = mongoose.models.orders || mongoose.model('orders', ordersSchema);

export default Order;
