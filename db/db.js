import mongoose from 'mongoose';
import { Dish } from './models/dish.js';

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