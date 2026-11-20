import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

import { Dish } from './models/dish.js';
import { User } from './models/user.js'

await mongoose.connect("mongodb://127.0.0.1:27017/restaurang");

export async function createDish(body) {
  return Dish.create(body);
}

export async function readDishes() {
  return Dish.find();
}

export async function readDish(id) {
  return Dish.findById(id);
}

export async function updateDish(id, dish) {
  console.log(id, dish)
  return Dish.findByIdAndUpdate(id, dish, { new: true });
}

export async function deleteDish(id) {
  return Dish.findByIdAndDelete(id);
}

export async function register(username, password) {
    const hash = await bcrypt.hash(password, 10);
    return User.create({ username, password: hash })
}

export async function specificUser(id){
  return User.findById(id);
}

export async function findUser(username){
  return User.findOne({ username })
}