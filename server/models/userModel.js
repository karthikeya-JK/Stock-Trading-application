import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usertype: { type: String, required: true, default: 'user' }, // 'user' or 'admin'
  password: { type: String, required: true },
  balance: { type: Number, default: 100000 } // Default balance of $100,000 for virtual trading
});

// Avoid OverwriteModelError
const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
