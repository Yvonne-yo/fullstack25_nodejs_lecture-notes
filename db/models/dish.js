import mongoose from 'mongoose';

// Schemat: vilka fält ett dokument har, och reglerna för dem
const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  category: { type: String, enum: ['starter', 'main', 'dessert'] },
});

// Modellen: det du använder för att skapa, läsa, ändra och ta bort
export const Dish = mongoose.model('Dish', dishSchema);