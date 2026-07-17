import { Transaction } from '../Schemas.js';

export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.email });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions', error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving all transactions', error: error.message });
  }
};
