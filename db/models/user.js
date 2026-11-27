import mongoose from 'mongoose';
import { ROLES } from '../../src/roles.js'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ROLES, default: 'guest' },
});

export const User = mongoose.model('User', userSchema);
