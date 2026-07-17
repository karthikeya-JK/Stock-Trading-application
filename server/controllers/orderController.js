import { Order, Stock, User, Transaction, getMarketStocks } from '../Schemas.js';

export const placeOrder = async (req, res) => {
  const { symbol, count, stockType, orderType } = req.body;

  if (!symbol || !count || count <= 0 || !stockType || !orderType) {
    return res.status(400).json({ message: 'Invalid order parameters' });
  }

  try {
    const marketStocks = getMarketStocks();
    const marketStock = marketStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());

    if (!marketStock) {
      return res.status(404).json({ message: 'Stock symbol not found in market registry' });
    }

    const price = marketStock.price;
    const qty = Number(count);
    const totalPrice = price * qty;
    const email = req.user.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const nowIso = new Date().toISOString();

    if (orderType.toLowerCase() === 'buy') {
      // Check funds
      if (user.balance < totalPrice) {
        return res.status(400).json({ message: `Insufficient funds. Need $${totalPrice.toFixed(2)}, but only have $${user.balance.toFixed(2)}` });
      }

      // Deduct balance
      user.balance -= totalPrice;
      await user.save();

      // Create / Update User Stock Holdings
      let holding = await Stock.findOne({ user: email, symbol: symbol.toUpperCase() });
      if (holding) {
        const newCount = holding.count + qty;
        const newTotalCost = holding.totalPrice + totalPrice;
        const newAvgPrice = newTotalCost / newCount;

        holding.count = newCount;
        holding.price = newAvgPrice;
        holding.totalPrice = newTotalCost;
        await holding.save();
      } else {
        await Stock.create({
          user: email,
          symbol: symbol.toUpperCase(),
          name: marketStock.name,
          price: price,
          count: qty,
          totalPrice: totalPrice,
          stockExchange: marketStock.stockExchange || 'NYSE'
        });
      }

      // Create Order record
      const order = await Order.create({
        user: email,
        symbol: symbol.toUpperCase(),
        name: marketStock.name,
        price,
        count: qty,
        totalPrice,
        stockType: stockType.toLowerCase(),
        orderType: 'buy',
        orderStatus: 'completed',
        time: nowIso
      });

      // Create Transaction log
      await Transaction.create({
        user: email,
        type: 'BUY',
        paymentMode: 'wallet',
        amount: totalPrice,
        time: nowIso
      });

      return res.status(201).json({
        message: 'Buy order executed successfully',
        order,
        balance: user.balance
      });

    } else if (orderType.toLowerCase() === 'sell') {
      // Check holdings
      const holding = await Stock.findOne({ user: email, symbol: symbol.toUpperCase() });
      if (!holding || holding.count < qty) {
        return res.status(400).json({ message: `Insufficient stock holdings. You own ${holding ? holding.count : 0} shares of ${symbol.toUpperCase()}, but tried to sell ${qty}` });
      }

      // Add balance
      user.balance += totalPrice;
      await user.save();

      // Update holdings
      if (holding.count === qty) {
        await Stock.deleteOne({ _id: holding._id });
      } else {
        holding.count -= qty;
        holding.totalPrice = holding.price * holding.count;
        await holding.save();
      }

      // Create Order record
      const order = await Order.create({
        user: email,
        symbol: symbol.toUpperCase(),
        name: marketStock.name,
        price,
        count: qty,
        totalPrice,
        stockType: stockType.toLowerCase(),
        orderType: 'sell',
        orderStatus: 'completed',
        time: nowIso
      });

      // Create Transaction log
      await Transaction.create({
        user: email,
        type: 'SELL',
        paymentMode: 'wallet',
        amount: totalPrice,
        time: nowIso
      });

      return res.status(201).json({
        message: 'Sell order executed successfully',
        order,
        balance: user.balance
      });

    } else {
      return res.status(400).json({ message: 'Invalid orderType, must be buy or sell' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Order execution failed', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.email });
    // Ensure time field exists for every order returned
    const normalized = orders.map(o => {
      const obj = o.toObject ? o.toObject() : o;
      if (!obj.time) {
        obj.time = obj.createdAt || new Date().toISOString();
      }
      return obj;
    });
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving orders', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    const normalized = orders.map(o => {
      const obj = o.toObject ? o.toObject() : o;
      if (!obj.time) {
        obj.time = obj.createdAt || new Date().toISOString();
      }
      return obj;
    });
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving all orders', error: error.message });
  }
};
