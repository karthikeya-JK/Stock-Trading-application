import { Stock, getMarketStocks, updateMarketStocks } from '../Schemas.js';

export const getUserHoldings = async (req, res) => {
  try {
    const holdings = await Stock.find({ user: req.user.email });
    
    // We want to return the holdings, but also attach the LATEST market price to calculate current gains/losses!
    const marketStocks = getMarketStocks();
    const updatedHoldings = holdings.map(holding => {
      const marketStock = marketStocks.find(s => s.symbol.toUpperCase() === holding.symbol.toUpperCase());
      const currentPrice = marketStock ? marketStock.price : holding.price;
      const currentValue = currentPrice * holding.count;
      const profitLoss = currentValue - holding.totalPrice;
      const profitLossPercentage = holding.totalPrice > 0 ? (profitLoss / holding.totalPrice) * 100 : 0;
      
      return {
        _id: holding._id,
        user: holding.user,
        symbol: holding.symbol,
        name: holding.name,
        purchasePrice: holding.price, // original purchase price
        count: holding.count,
        totalPrice: holding.totalPrice, // original cost
        stockExchange: holding.stockExchange,
        currentPrice,
        currentValue,
        profitLoss,
        profitLossPercentage
      };
    });

    res.json(updatedHoldings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user holdings', error: error.message });
  }
};

export const getMarketStocksList = async (req, res) => {
  try {
    const stocks = getMarketStocks();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving market stocks', error: error.message });
  }
};

export const getStockDetails = async (req, res) => {
  const { symbol } = req.params;
  try {
    const marketStocks = getMarketStocks();
    const stock = marketStocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving stock details', error: error.message });
  }
};

export const adminUpdateStock = async (req, res) => {
  const { symbol } = req.params;
  const { name, price, change, high, low, volume } = req.body;

  try {
    const marketStocks = getMarketStocks();
    const idx = marketStocks.findIndex(s => s.symbol.toUpperCase() === symbol.toUpperCase());

    if (idx === -1) {
      return res.status(404).json({ message: 'Stock not found in market registry' });
    }

    if (name) marketStocks[idx].name = name;
    if (price) marketStocks[idx].price = Number(price);
    if (change !== undefined) marketStocks[idx].change = Number(change);
    if (high) marketStocks[idx].high = Number(high);
    if (low) marketStocks[idx].low = Number(low);
    if (volume) marketStocks[idx].volume = Number(volume);

    updateMarketStocks(marketStocks);

    res.json({ message: 'Stock updated successfully', stock: marketStocks[idx] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};

export const adminAddStock = async (req, res) => {
  const { symbol, name, price, stockExchange } = req.body;

  if (!symbol || !name || !price) {
    return res.status(400).json({ message: 'Please provide symbol, name, and starting price' });
  }

  try {
    const marketStocks = getMarketStocks();
    const exists = marketStocks.some(s => s.symbol.toUpperCase() === symbol.toUpperCase());

    if (exists) {
      return res.status(400).json({ message: 'Stock symbol already exists in market registry' });
    }

    const newStock = {
      _id: 's' + (marketStocks.length + 1),
      symbol: symbol.toUpperCase(),
      name,
      price: Number(price),
      change: 0.00,
      high: Number(price),
      low: Number(price),
      volume: 1000000,
      stockExchange: stockExchange || 'NYSE'
    };

    marketStocks.push(newStock);
    updateMarketStocks(marketStocks);

    res.status(201).json({ message: 'Stock added successfully', stock: newStock });
  } catch (error) {
    res.status(500).json({ message: 'Error adding stock', error: error.message });
  }
};
