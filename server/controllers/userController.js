import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Transaction } from '../Schemas.js';

const generateToken = (email) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'sbstockssecretkey12345';
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { username, email, password, usertype } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Determine user type (default 'user', unless specified as admin or email contains admin)
    let assignedType = usertype || 'user';
    if (email.toLowerCase().includes('admin')) {
      assignedType = 'admin';
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      usertype: assignedType,
      balance: 100000 // Starting simulator balance: $100,000
    });

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      usertype: newUser.usertype,
      balance: newUser.balance,
      token: generateToken(newUser.email)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
      balance: user.balance,
      token: generateToken(user.email)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
      balance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

export const updateUserBalance = async (req, res) => {
  const { action, amount, paymentMode } = req.body; // action: 'deposit' or 'withdraw'

  if (!action || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid action or amount' });
  }

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const numericAmount = Number(amount);

    if (action === 'withdraw') {
      if (user.balance < numericAmount) {
        return res.status(400).json({ message: 'Insufficient balance to withdraw' });
      }
      user.balance -= numericAmount;
    } else if (action === 'deposit') {
      user.balance += numericAmount;
    } else {
      return res.status(400).json({ message: 'Invalid action, must be deposit or withdraw' });
    }

    await user.save();

    // Create a transaction log
    await Transaction.create({
      user: user.email,
      type: action.toUpperCase(), // 'DEPOSIT' or 'WITHDRAW'
      paymentMode: paymentMode || 'bank',
      amount: numericAmount,
      time: new Date().toISOString()
    });

    res.json({
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful`,
      balance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating balance', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // Sanitize to omit password fields
    const sanitized = users.map(u => ({
      _id: u._id,
      username: u.username,
      email: u.email,
      usertype: u.usertype,
      balance: u.balance
    }));
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};
